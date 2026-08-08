package service

import (
	"regexp"
)

type PIIMaskerService interface {
	Mask(text string) string
}

type piiMaskerService struct {
	nikRegex     *regexp.Regexp
	emailRegex   *regexp.Regexp
	phoneRegex   *regexp.Regexp
	nominalRegex *regexp.Regexp
}

func NewPIIMaskerService() PIIMaskerService {
	return &piiMaskerService{
		nikRegex:     regexp.MustCompile(`\b\d{16}\b`),
		emailRegex:   regexp.MustCompile(`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`),
		phoneRegex:   regexp.MustCompile(`\+?62\d{9,13}|\b08\d{8,11}\b`),
		nominalRegex: regexp.MustCompile(`(?i)(rp|rupiah)\s*\.?\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?`),
	}
}

func (s *piiMaskerService) Mask(text string) string {
	text = s.nikRegex.ReplaceAllString(text, "[NIK_MASKED]")
	text = s.emailRegex.ReplaceAllString(text, "[KONTAK_MASKED]")
	text = s.phoneRegex.ReplaceAllString(text, "[KONTAK_MASKED]")
	text = s.nominalRegex.ReplaceAllString(text, "[NOMINAL_MASKED]")
	// Note: Name masking usually requires NLP NER; using basic regex for MVP.
	return text
}
