package service

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"
	"ozikcarbon-backend/config"
)

type EmailService interface {
	SendWelcomeEmail(toEmail, toName string)
}

type emailService struct {
	cfg *config.Config
}

func NewEmailService(cfg *config.Config) EmailService {
	return &emailService{cfg: cfg}
}

func (s *emailService) SendWelcomeEmail(toEmail, toName string) {
	if s.cfg.SMTPHost == "" || s.cfg.SMTPPort == "" {
		log.Println("EmailService: SMTP not configured, skipping welcome email.")
		return
	}

	from := s.cfg.SMTPFromEmail
	if from == "" {
		from = "support@oziksustain.my.id"
	}
	pass := s.cfg.SMTPPass
	user := s.cfg.SMTPUser
	host := s.cfg.SMTPHost
	port := s.cfg.SMTPPort

	subject := "Selamat Datang di Ozik Sustain!"

	// Green and White HTML theme
	body := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<style>
			body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4; margin: 0; padding: 0; }
			.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-top: 4px solid #064e3b; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
			.header { padding: 30px; text-align: center; background-color: #022c22; color: #ffffff; }
			.header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
			.content { padding: 30px; color: #1f2937; line-height: 1.6; }
			.content h2 { color: #064e3b; font-size: 20px; }
			.footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; background-color: #f9fafb; border-top: 1px solid #e5e7eb; }
			.btn { display: inline-block; padding: 12px 24px; background-color: #064e3b; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; text-transform: uppercase; }
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h1>Ozik Sustain</h1>
			</div>
			<div class="content">
				<h2>Halo %s,</h2>
				<p>Selamat datang di <strong>Ozik Sustain</strong>! Kami sangat senang Anda bergabung dengan platform Guard AI kami untuk kepatuhan regulasi dan audit proyek PDD.</p>
				<p>Sebagai pengguna baru, notifikasi email Anda telah aktif secara otomatis. Anda bisa mengelolanya kapan saja melalui halaman <strong>Pengaturan - Notifikasi</strong> di dasbor Anda.</p>
				<p>Mari mulai menggunakan fitur audit pintar dan pelacakan regulasi kami hari ini.</p>
				<center>
					<a href="https://oziksustain.my.id/dashboard" class="btn">Mulai Audit Sekarang</a>
				</center>
			</div>
			<div class="footer">
				<p>&copy; 2024 Ozik Sustain. Hak cipta dilindungi undang-undang.</p>
				<p>Anda menerima email ini karena mendaftar di Ozik Sustain.</p>
			</div>
		</div>
	</body>
	</html>
	`, toName)

	headers := make(map[string]string)
	headers["From"] = fmt.Sprintf("Ozik Sustain <%s>", from)
	headers["To"] = toEmail
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=\"utf-8\""

	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + body

	auth := smtp.PlainAuth("", user, pass, host)

	addr := host + ":" + port
	
	var err error
	if port == "465" {
		tlsconfig := &tls.Config{
			InsecureSkipVerify: true,
			ServerName: host,
		}
		
		conn, errConn := tls.Dial("tcp", addr, tlsconfig)
		if errConn != nil {
			log.Printf("EmailService: Failed to connect to %s: %v\n", addr, errConn)
			return
		}
		
		client, errClient := smtp.NewClient(conn, host)
		if errClient != nil {
			log.Printf("EmailService: Failed to create SMTP client: %v\n", errClient)
			return
		}
		defer client.Close()
		
		if err = client.Auth(auth); err != nil {
			log.Printf("EmailService: SMTP Auth failed: %v\n", err)
			return
		}
		
		if err = client.Mail(from); err != nil {
			log.Printf("EmailService: SMTP Mail from failed: %v\n", err)
			return
		}
		
		if err = client.Rcpt(toEmail); err != nil {
			log.Printf("EmailService: SMTP Rcpt to failed: %v\n", err)
			return
		}
		
		w, errData := client.Data()
		if errData != nil {
			log.Printf("EmailService: SMTP Data failed: %v\n", errData)
			return
		}
		
		_, err = w.Write([]byte(message))
		if err != nil {
			log.Printf("EmailService: Failed to write body: %v\n", err)
			return
		}
		
		err = w.Close()
		if err != nil {
			log.Printf("EmailService: Failed to close writer: %v\n", err)
			return
		}
		
		client.Quit()
	} else {
		err = smtp.SendMail(addr, auth, from, []string{toEmail}, []byte(message))
	}

	if err != nil {
		log.Printf("EmailService: Failed to send welcome email to %s: %v\n", toEmail, err)
	} else {
		log.Printf("EmailService: Welcome email sent successfully to %s\n", toEmail)
	}
}
