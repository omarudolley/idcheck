import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, FileSearch, Globe2, ShieldCheck } from "lucide-react";
import logo from "../assets/logo.png"

type Country = {
  code: string;
  name: string;
  taxHint: string;
  companyHint: string;
  taxPattern?: RegExp;
  companyPattern?: RegExp;
};

type ApiError = {
  field?: string;
  message: string;
};

type ApiResult = {
  valid: boolean;
  errors?: ApiError[];
};

const countries: Country[] = [
  { code: "AF", name: "Afghanistan", taxHint: "TIN, 8-10 digits", companyHint: "Registration number", taxPattern: /^\d{8,10}$/ },
  { code: "AX", name: "Åland Islands", taxHint: "Finnish VAT format", companyHint: "Business ID", taxPattern: /^(FI)?\d{8}$/i },
  { code: "AL", name: "Albania", taxHint: "NIPT, 10 chars", companyHint: "NIPT/company number", taxPattern: /^[A-Z]\d{8}[A-Z]$/i },
  { code: "DZ", name: "Algeria", taxHint: "NIF, 15 digits", companyHint: "RC number", taxPattern: /^\d{15}$/ },
  { code: "AS", name: "American Samoa", taxHint: "EIN/TIN", companyHint: "Entity number", taxPattern: /^\d{2}-?\d{7}$/ },
  { code: "AD", name: "Andorra", taxHint: "NRT, letter + 6 digits + letter", companyHint: "Company registry number", taxPattern: /^[A-Z]\d{6}[A-Z]$/i },
  { code: "AO", name: "Angola", taxHint: "NIF, 10 digits", companyHint: "Commercial registry", taxPattern: /^\d{10}$/ },
  { code: "AI", name: "Anguilla", taxHint: "TIN", companyHint: "Company number" },
  { code: "AQ", name: "Antarctica", taxHint: "Research entity ID", companyHint: "Organization ID" },
  { code: "AG", name: "Antigua and Barbuda", taxHint: "TIN", companyHint: "Company number" },
  { code: "AR", name: "Argentina", taxHint: "CUIT, 11 digits", companyHint: "CUIT/company registration", taxPattern: /^\d{2}-?\d{8}-?\d$/ },
  { code: "AM", name: "Armenia", taxHint: "TIN, 8 digits", companyHint: "State registry number", taxPattern: /^\d{8}$/ },
  { code: "AW", name: "Aruba", taxHint: "TIN", companyHint: "Chamber number" },
  { code: "AU", name: "Australia", taxHint: "ABN, 11 digits", companyHint: "ACN, 9 digits", taxPattern: /^\d{11}$/, companyPattern: /^\d{9}$/ },
  { code: "AT", name: "Austria", taxHint: "VAT: ATU + 8 digits", companyHint: "Firmenbuchnummer", taxPattern: /^ATU\d{8}$/i },
  { code: "AZ", name: "Azerbaijan", taxHint: "TIN, 10 digits", companyHint: "Registration number", taxPattern: /^\d{10}$/ },
  { code: "BS", name: "Bahamas", taxHint: "TIN", companyHint: "Company number" },
  { code: "BH", name: "Bahrain", taxHint: "VAT, 15 digits", companyHint: "CR number", taxPattern: /^\d{15}$/ },
  { code: "BD", name: "Bangladesh", taxHint: "TIN, 12 digits", companyHint: "BIN/company ID", taxPattern: /^\d{12}$/ },
  { code: "BB", name: "Barbados", taxHint: "TIN", companyHint: "Corporate affairs number" },
  { code: "BY", name: "Belarus", taxHint: "UNP, 9 chars", companyHint: "UNP", taxPattern: /^[A-Z0-9]{9}$/i },
  { code: "BE", name: "Belgium", taxHint: "VAT: BE + 10 digits", companyHint: "Enterprise number", taxPattern: /^BE\d{10}$/i, companyPattern: /^\d{10}$/ },
  { code: "BZ", name: "Belize", taxHint: "TIN", companyHint: "Company number" },
  { code: "BJ", name: "Benin", taxHint: "IFU, 13 digits", companyHint: "RCCM", taxPattern: /^\d{13}$/ },
  { code: "BM", name: "Bermuda", taxHint: "Tax registration", companyHint: "Company number" },
  { code: "BT", name: "Bhutan", taxHint: "TPN", companyHint: "Company registry" },
  { code: "BO", name: "Bolivia", taxHint: "NIT, 7-12 digits", companyHint: "Commercial registry", taxPattern: /^\d{7,12}$/ },
  { code: "BQ", name: "Bonaire, Sint Eustatius and Saba", taxHint: "CRIB number", companyHint: "Chamber number" },
  { code: "BA", name: "Bosnia and Herzegovina", taxHint: "TIN/VAT, 12-13 digits", companyHint: "Company ID", taxPattern: /^\d{12,13}$/ },
  { code: "BW", name: "Botswana", taxHint: "TIN", companyHint: "Company number" },
  { code: "BR", name: "Brazil", taxHint: "CNPJ, 14 digits", companyHint: "CNPJ", taxPattern: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/ },
  { code: "IO", name: "British Indian Ocean Territory", taxHint: "Tax ID", companyHint: "Company number" },
  { code: "BN", name: "Brunei Darussalam", taxHint: "TIN", companyHint: "ROC number" },
  { code: "BG", name: "Bulgaria", taxHint: "VAT: BG + 9/10 digits", companyHint: "UIC, 9 digits", taxPattern: /^BG\d{9,10}$/i, companyPattern: /^\d{9}$/ },
  { code: "BF", name: "Burkina Faso", taxHint: "IFU", companyHint: "RCCM" },
  { code: "BI", name: "Burundi", taxHint: "NIF", companyHint: "Company registry" },
  { code: "CV", name: "Cabo Verde", taxHint: "NIF, 9 digits", companyHint: "Commercial registry", taxPattern: /^\d{9}$/ },
  { code: "KH", name: "Cambodia", taxHint: "TIN", companyHint: "Business registration" },
  { code: "CM", name: "Cameroon", taxHint: "NIU", companyHint: "RCCM" },
  { code: "CA", name: "Canada", taxHint: "BN, 9 digits", companyHint: "Corporation number", taxPattern: /^\d{9}(RT\d{4})?$/i },
  { code: "KY", name: "Cayman Islands", taxHint: "TIN", companyHint: "Company number" },
  { code: "CF", name: "Central African Republic", taxHint: "NIF", companyHint: "RCCM" },
  { code: "TD", name: "Chad", taxHint: "NIF", companyHint: "RCCM" },
  { code: "CL", name: "Chile", taxHint: "RUT, 8-9 chars", companyHint: "RUT", taxPattern: /^\d{7,8}-?[\dK]$/i },
  { code: "CN", name: "China", taxHint: "USCC, 18 chars", companyHint: "Unified social credit code", taxPattern: /^[0-9A-Z]{18}$/i, companyPattern: /^[0-9A-Z]{18}$/i },
  { code: "CX", name: "Christmas Island", taxHint: "ABN format", companyHint: "ACN format", taxPattern: /^\d{11}$/ },
  { code: "CC", name: "Cocos Islands", taxHint: "ABN format", companyHint: "ACN format", taxPattern: /^\d{11}$/ },
  { code: "CO", name: "Colombia", taxHint: "NIT, 9-10 digits", companyHint: "NIT", taxPattern: /^\d{9,10}-?\d?$/ },
  { code: "KM", name: "Comoros", taxHint: "NIF", companyHint: "Registry number" },
  { code: "CG", name: "Congo", taxHint: "NIU", companyHint: "RCCM" },
  { code: "CD", name: "Congo, Democratic Republic", taxHint: "NIF", companyHint: "RCCM" },
  { code: "CK", name: "Cook Islands", taxHint: "RMD number", companyHint: "Company number" },
  { code: "CR", name: "Costa Rica", taxHint: "Tax ID, 9-12 digits", companyHint: "Cedula juridica", taxPattern: /^\d{9,12}$/ },
  { code: "CI", name: "Côte d’Ivoire", taxHint: "NCC", companyHint: "RCCM" },
  { code: "HR", name: "Croatia", taxHint: "OIB, 11 digits", companyHint: "OIB", taxPattern: /^\d{11}$/ },
  { code: "CU", name: "Cuba", taxHint: "NIT", companyHint: "Registry ID" },
  { code: "CW", name: "Curaçao", taxHint: "CRIB number", companyHint: "Chamber number" },
  { code: "CY", name: "Cyprus", taxHint: "VAT: CY + 8 digits + letter", companyHint: "HE number", taxPattern: /^CY\d{8}[A-Z]$/i },
  { code: "CZ", name: "Czechia", taxHint: "VAT: CZ + 8-10 digits", companyHint: "ICO, 8 digits", taxPattern: /^CZ\d{8,10}$/i, companyPattern: /^\d{8}$/ },
  { code: "DK", name: "Denmark", taxHint: "CVR/VAT: DK + 8 digits", companyHint: "CVR, 8 digits", taxPattern: /^(DK)?\d{8}$/i, companyPattern: /^\d{8}$/ },
  { code: "DJ", name: "Djibouti", taxHint: "NIF", companyHint: "Registry number" },
  { code: "DM", name: "Dominica", taxHint: "TIN", companyHint: "Company number" },
  { code: "DO", name: "Dominican Republic", taxHint: "RNC, 9 digits", companyHint: "RNC", taxPattern: /^\d{9}$/ },
  { code: "EC", name: "Ecuador", taxHint: "RUC, 13 digits", companyHint: "RUC", taxPattern: /^\d{13}$/ },
  { code: "EG", name: "Egypt", taxHint: "Tax card, 9 digits", companyHint: "Commercial register", taxPattern: /^\d{9}$/ },
  { code: "SV", name: "El Salvador", taxHint: "NIT, 14 digits", companyHint: "NRC", taxPattern: /^\d{14}$/ },
  { code: "GQ", name: "Equatorial Guinea", taxHint: "NIF", companyHint: "Registry number" },
  { code: "ER", name: "Eritrea", taxHint: "TIN", companyHint: "Company registry" },
  { code: "EE", name: "Estonia", taxHint: "VAT: EE + 9 digits", companyHint: "Registry code, 8 digits", taxPattern: /^EE\d{9}$/i, companyPattern: /^\d{8}$/ },
  { code: "SZ", name: "Eswatini", taxHint: "TIN", companyHint: "Company number" },
  { code: "ET", name: "Ethiopia", taxHint: "TIN, 10 digits", companyHint: "Business license", taxPattern: /^\d{10}$/ },
  { code: "FK", name: "Falkland Islands", taxHint: "Tax ID", companyHint: "Company number" },
  { code: "FO", name: "Faroe Islands", taxHint: "VAT, 6 digits", companyHint: "Registration number", taxPattern: /^\d{6}$/ },
  { code: "FJ", name: "Fiji", taxHint: "TIN", companyHint: "Company number" },
  { code: "FI", name: "Finland", taxHint: "VAT: FI + 8 digits", companyHint: "Business ID, 8 digits", taxPattern: /^FI\d{8}$/i, companyPattern: /^\d{7}-?\d$/ },
  { code: "FR", name: "France", taxHint: "VAT: FR + 11 chars", companyHint: "SIREN, 9 digits", taxPattern: /^FR[A-Z0-9]{2}\d{9}$/i, companyPattern: /^\d{9}$/ },
  { code: "GF", name: "French Guiana", taxHint: "French VAT/SIREN", companyHint: "SIREN", companyPattern: /^\d{9}$/ },
  { code: "PF", name: "French Polynesia", taxHint: "Tahiti number", companyHint: "Tahiti number" },
  { code: "TF", name: "French Southern Territories", taxHint: "Tax ID", companyHint: "Organization ID" },
  { code: "GA", name: "Gabon", taxHint: "NIF", companyHint: "RCCM" },
  { code: "GM", name: "Gambia", taxHint: "TIN", companyHint: "Company number" },
  { code: "GE", name: "Georgia", taxHint: "TIN, 9 digits", companyHint: "Identification code", taxPattern: /^\d{9}$/ },
  { code: "DE", name: "Germany", taxHint: "VAT: DE + 9 digits", companyHint: "HRB/HRA number", taxPattern: /^DE\d{9}$/i },
  { code: "GH", name: "Ghana", taxHint: "TIN/GRA, 11-15 chars", companyHint: "Company number", taxPattern: /^[A-Z0-9-]{11,15}$/i },
  { code: "GI", name: "Gibraltar", taxHint: "TIN", companyHint: "Company number" },
  { code: "GR", name: "Greece", taxHint: "VAT: EL + 9 digits", companyHint: "GEMI number", taxPattern: /^EL\d{9}$/i },
  { code: "GL", name: "Greenland", taxHint: "GER number", companyHint: "GER number" },
  { code: "GD", name: "Grenada", taxHint: "TIN", companyHint: "Company number" },
  { code: "GP", name: "Guadeloupe", taxHint: "French VAT/SIREN", companyHint: "SIREN", companyPattern: /^\d{9}$/ },
  { code: "GU", name: "Guam", taxHint: "EIN/TIN", companyHint: "Entity number", taxPattern: /^\d{2}-?\d{7}$/ },
  { code: "GT", name: "Guatemala", taxHint: "NIT", companyHint: "Commercial registry" },
  { code: "GG", name: "Guernsey", taxHint: "Tax reference", companyHint: "Company number" },
  { code: "GN", name: "Guinea", taxHint: "NIF", companyHint: "RCCM" },
  { code: "GW", name: "Guinea-Bissau", taxHint: "NIF", companyHint: "Registry number" },
  { code: "GY", name: "Guyana", taxHint: "TIN", companyHint: "Company number" },
  { code: "HT", name: "Haiti", taxHint: "NIF", companyHint: "Registry number" },
  { code: "HM", name: "Heard Island and McDonald Islands", taxHint: "Tax ID", companyHint: "Organization ID" },
  { code: "VA", name: "Holy See", taxHint: "Tax ID", companyHint: "Registry number" },
  { code: "HN", name: "Honduras", taxHint: "RTN, 14 digits", companyHint: "RTN", taxPattern: /^\d{14}$/ },
  { code: "HK", name: "Hong Kong", taxHint: "BR number, 8 digits", companyHint: "Company number", taxPattern: /^\d{8}$/ },
  { code: "HU", name: "Hungary", taxHint: "VAT: HU + 8 digits", companyHint: "Company number", taxPattern: /^HU\d{8}$/i },
  { code: "IS", name: "Iceland", taxHint: "KT, 10 digits", companyHint: "Kennitala", taxPattern: /^\d{10}$/ },
  { code: "IN", name: "India", taxHint: "GSTIN, 15 chars", companyHint: "CIN, 21 chars", taxPattern: /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/i, companyPattern: /^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i },
  { code: "ID", name: "Indonesia", taxHint: "NPWP, 15-16 digits", companyHint: "NIB, 13 digits", taxPattern: /^\d{15,16}$/, companyPattern: /^\d{13}$/ },
  { code: "IR", name: "Iran", taxHint: "Economic code, 12 digits", companyHint: "Registration number", taxPattern: /^\d{12}$/ },
  { code: "IQ", name: "Iraq", taxHint: "Tax ID", companyHint: "Company registry" },
  { code: "IE", name: "Ireland", taxHint: "VAT: IE + 8-9 chars", companyHint: "CRO number", taxPattern: /^IE[A-Z0-9]{8,9}$/i },
  { code: "IM", name: "Isle of Man", taxHint: "VAT: GB/IM format", companyHint: "Company number" },
  { code: "IL", name: "Israel", taxHint: "VAT/company ID, 9 digits", companyHint: "Company ID, 9 digits", taxPattern: /^\d{9}$/, companyPattern: /^\d{9}$/ },
  { code: "IT", name: "Italy", taxHint: "VAT: IT + 11 digits", companyHint: "REA/company ID", taxPattern: /^IT\d{11}$/i },
  { code: "JM", name: "Jamaica", taxHint: "TRN, 9 digits", companyHint: "Company number", taxPattern: /^\d{9}$/ },
  { code: "JP", name: "Japan", taxHint: "Corporate number, 13 digits", companyHint: "Corporate number", taxPattern: /^\d{13}$/, companyPattern: /^\d{13}$/ },
  { code: "JE", name: "Jersey", taxHint: "TIN", companyHint: "Company number" },
  { code: "JO", name: "Jordan", taxHint: "Tax number", companyHint: "National number" },
  { code: "KZ", name: "Kazakhstan", taxHint: "BIN/IIN, 12 digits", companyHint: "BIN, 12 digits", taxPattern: /^\d{12}$/, companyPattern: /^\d{12}$/ },
  { code: "KE", name: "Kenya", taxHint: "PIN, 11 chars", companyHint: "Registration number", taxPattern: /^[A-Z]\d{9}[A-Z]$/i },
  { code: "KI", name: "Kiribati", taxHint: "TIN", companyHint: "Company number" },
  { code: "KP", name: "Korea, North", taxHint: "Tax ID", companyHint: "Registry number" },
  { code: "KR", name: "Korea, South", taxHint: "BRN, 10 digits", companyHint: "Corporate reg, 13 digits", taxPattern: /^\d{10}$/, companyPattern: /^\d{13}$/ },
  { code: "KW", name: "Kuwait", taxHint: "Tax card number", companyHint: "Commercial registration" },
  { code: "KG", name: "Kyrgyzstan", taxHint: "TIN, 14 digits", companyHint: "OKPO", taxPattern: /^\d{14}$/ },
  { code: "LA", name: "Lao People’s Democratic Republic", taxHint: "TIN", companyHint: "Enterprise number" },
  { code: "LV", name: "Latvia", taxHint: "VAT: LV + 11 digits", companyHint: "Registration number, 11 digits", taxPattern: /^LV\d{11}$/i, companyPattern: /^\d{11}$/ },
  { code: "LB", name: "Lebanon", taxHint: "MOF number", companyHint: "Commercial registry" },
  { code: "LS", name: "Lesotho", taxHint: "TIN", companyHint: "Company number" },
  { code: "LR", name: "Liberia", taxHint: "TIN", companyHint: "Business registry" },
  { code: "LY", name: "Libya", taxHint: "Tax ID", companyHint: "Commercial registry" },
  { code: "LI", name: "Liechtenstein", taxHint: "FL + 5 digits", companyHint: "Commercial registry", taxPattern: /^FL\d{5}$/i },
  { code: "LT", name: "Lithuania", taxHint: "VAT: LT + 9/12 digits", companyHint: "Company code, 9 digits", taxPattern: /^LT\d{9,12}$/i, companyPattern: /^\d{9}$/ },
  { code: "LU", name: "Luxembourg", taxHint: "VAT: LU + 8 digits", companyHint: "RCS number", taxPattern: /^LU\d{8}$/i },
  { code: "MO", name: "Macao", taxHint: "M/ taxpayer number", companyHint: "Commercial registry" },
  { code: "MG", name: "Madagascar", taxHint: "NIF", companyHint: "RCS" },
  { code: "MW", name: "Malawi", taxHint: "TPIN", companyHint: "Company number" },
  { code: "MY", name: "Malaysia", taxHint: "TIN, 10-13 chars", companyHint: "SSM number", taxPattern: /^[A-Z0-9]{10,13}$/i },
  { code: "MV", name: "Maldives", taxHint: "TIN", companyHint: "Company number" },
  { code: "ML", name: "Mali", taxHint: "NIF", companyHint: "RCCM" },
  { code: "MT", name: "Malta", taxHint: "VAT: MT + 8 digits", companyHint: "Company number", taxPattern: /^MT\d{8}$/i },
  { code: "MH", name: "Marshall Islands", taxHint: "TIN", companyHint: "Entity number" },
  { code: "MQ", name: "Martinique", taxHint: "French VAT/SIREN", companyHint: "SIREN", companyPattern: /^\d{9}$/ },
  { code: "MR", name: "Mauritania", taxHint: "NIF", companyHint: "Registry number" },
  { code: "MU", name: "Mauritius", taxHint: "TAN/VAT", companyHint: "BRN" },
  { code: "YT", name: "Mayotte", taxHint: "French VAT/SIREN", companyHint: "SIREN", companyPattern: /^\d{9}$/ },
  { code: "MX", name: "Mexico", taxHint: "RFC, 12-13 chars", companyHint: "RFC", taxPattern: /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i },
  { code: "FM", name: "Micronesia", taxHint: "TIN", companyHint: "Company number" },
  { code: "MD", name: "Moldova", taxHint: "IDNO, 13 digits", companyHint: "IDNO", taxPattern: /^\d{13}$/, companyPattern: /^\d{13}$/ },
  { code: "MC", name: "Monaco", taxHint: "VAT: FR-compatible", companyHint: "RCI number" },
  { code: "MN", name: "Mongolia", taxHint: "Register number", companyHint: "State registration" },
  { code: "ME", name: "Montenegro", taxHint: "PIB, 8 digits", companyHint: "CRPS", taxPattern: /^\d{8}$/ },
  { code: "MS", name: "Montserrat", taxHint: "TIN", companyHint: "Company number" },
  { code: "MA", name: "Morocco", taxHint: "ICE, 15 digits", companyHint: "RC/ICE", taxPattern: /^\d{15}$/ },
  { code: "MZ", name: "Mozambique", taxHint: "NUIT, 9 digits", companyHint: "Commercial registry", taxPattern: /^\d{9}$/ },
  { code: "MM", name: "Myanmar", taxHint: "TIN", companyHint: "Company registration" },
  { code: "NA", name: "Namibia", taxHint: "TIN", companyHint: "Company number" },
  { code: "NR", name: "Nauru", taxHint: "TIN", companyHint: "Corporation number" },
  { code: "NP", name: "Nepal", taxHint: "PAN, 9 digits", companyHint: "Company registration", taxPattern: /^\d{9}$/ },
  { code: "NL", name: "Netherlands", taxHint: "VAT: NL + 9 digits + B + 2 digits", companyHint: "KVK, 8 digits", taxPattern: /^NL\d{9}B\d{2}$/i, companyPattern: /^\d{8}$/ },
  { code: "NC", name: "New Caledonia", taxHint: "RIDET", companyHint: "RIDET" },
  { code: "NZ", name: "New Zealand", taxHint: "IRD, 8-9 digits", companyHint: "NZBN, 13 digits", taxPattern: /^\d{8,9}$/, companyPattern: /^\d{13}$/ },
  { code: "NI", name: "Nicaragua", taxHint: "RUC", companyHint: "RUC" },
  { code: "NE", name: "Niger", taxHint: "NIF", companyHint: "RCCM" },
  { code: "NG", name: "Nigeria", taxHint: "TIN, 8-14 chars", companyHint: "RC number", taxPattern: /^[0-9A-Z-]{8,14}$/i },
  { code: "NU", name: "Niue", taxHint: "TIN", companyHint: "Company number" },
  { code: "NF", name: "Norfolk Island", taxHint: "ABN format", companyHint: "Company number" },
  { code: "MK", name: "North Macedonia", taxHint: "EDB, 13 digits", companyHint: "EMBS, 7 digits", taxPattern: /^\d{13}$/, companyPattern: /^\d{7}$/ },
  { code: "MP", name: "Northern Mariana Islands", taxHint: "EIN/TIN", companyHint: "Entity number", taxPattern: /^\d{2}-?\d{7}$/ },
  { code: "NO", name: "Norway", taxHint: "VAT: NO + 9 digits + MVA", companyHint: "Org nr, 9 digits", taxPattern: /^NO\d{9}MVA$/i, companyPattern: /^\d{9}$/ },
  { code: "OM", name: "Oman", taxHint: "VAT, 10 digits", companyHint: "CR number", taxPattern: /^\d{10}$/ },
  { code: "PK", name: "Pakistan", taxHint: "NTN, 7 digits", companyHint: "SECP number", taxPattern: /^\d{7}$/ },
  { code: "PW", name: "Palau", taxHint: "TIN", companyHint: "Company number" },
  { code: "PS", name: "Palestine", taxHint: "Tax ID", companyHint: "Company number" },
  { code: "PA", name: "Panama", taxHint: "RUC", companyHint: "RUC/company folio" },
  { code: "PG", name: "Papua New Guinea", taxHint: "TIN", companyHint: "Company number" },
  { code: "PY", name: "Paraguay", taxHint: "RUC, 6-9 digits + check", companyHint: "RUC", taxPattern: /^\d{6,9}-?\d$/ },
  { code: "PE", name: "Peru", taxHint: "RUC, 11 digits", companyHint: "RUC", taxPattern: /^\d{11}$/ },
  { code: "PH", name: "Philippines", taxHint: "TIN, 9-12 digits", companyHint: "SEC/DTI number", taxPattern: /^\d{9,12}$/ },
  { code: "PN", name: "Pitcairn", taxHint: "Tax ID", companyHint: "Registry number" },
  { code: "PL", name: "Poland", taxHint: "VAT/NIP: PL + 10 digits", companyHint: "KRS, 10 digits", taxPattern: /^PL\d{10}$/i, companyPattern: /^\d{10}$/ },
  { code: "PT", name: "Portugal", taxHint: "VAT/NIF: PT + 9 digits", companyHint: "NIPC, 9 digits", taxPattern: /^PT\d{9}$/i, companyPattern: /^\d{9}$/ },
  { code: "PR", name: "Puerto Rico", taxHint: "EIN/TIN", companyHint: "Registry number", taxPattern: /^\d{2}-?\d{7}$/ },
  { code: "QA", name: "Qatar", taxHint: "Tax card, 11 digits", companyHint: "CR number", taxPattern: /^\d{11}$/ },
  { code: "RE", name: "Réunion", taxHint: "French VAT/SIREN", companyHint: "SIREN", companyPattern: /^\d{9}$/ },
  { code: "RO", name: "Romania", taxHint: "VAT: RO + 2-10 digits", companyHint: "CUI", taxPattern: /^RO\d{2,10}$/i },
  { code: "RU", name: "Russia", taxHint: "INN, 10/12 digits", companyHint: "OGRN, 13 digits", taxPattern: /^\d{10}|\d{12}$/, companyPattern: /^\d{13}$/ },
  { code: "RW", name: "Rwanda", taxHint: "TIN, 9 digits", companyHint: "Company code", taxPattern: /^\d{9}$/ },
  { code: "BL", name: "Saint Barthélemy", taxHint: "French VAT/SIREN", companyHint: "SIREN" },
  { code: "SH", name: "Saint Helena", taxHint: "Tax ID", companyHint: "Company number" },
  { code: "KN", name: "Saint Kitts and Nevis", taxHint: "TIN", companyHint: "Company number" },
  { code: "LC", name: "Saint Lucia", taxHint: "TIN", companyHint: "Company number" },
  { code: "MF", name: "Saint Martin", taxHint: "French VAT/SIREN", companyHint: "SIREN" },
  { code: "PM", name: "Saint Pierre and Miquelon", taxHint: "French VAT/SIREN", companyHint: "SIREN" },
  { code: "VC", name: "Saint Vincent and the Grenadines", taxHint: "TIN", companyHint: "Company number" },
  { code: "WS", name: "Samoa", taxHint: "TIN", companyHint: "Company number" },
  { code: "SM", name: "San Marino", taxHint: "COE/ISS", companyHint: "Company code" },
  { code: "ST", name: "Sao Tome and Principe", taxHint: "NIF", companyHint: "Registry number" },
  { code: "SA", name: "Saudi Arabia", taxHint: "VAT, 15 digits", companyHint: "CR number", taxPattern: /^\d{15}$/ },
  { code: "SN", name: "Senegal", taxHint: "NINEA", companyHint: "RCCM" },
  { code: "RS", name: "Serbia", taxHint: "PIB, 9 digits", companyHint: "MB, 8 digits", taxPattern: /^\d{9}$/, companyPattern: /^\d{8}$/ },
  { code: "SC", name: "Seychelles", taxHint: "TIN", companyHint: "Company number" },
  { code: "SL", name: "Sierra Leone", taxHint: "TIN", companyHint: "Company number" },
  { code: "SG", name: "Singapore", taxHint: "GST/UEN", companyHint: "UEN, 9-10 chars", taxPattern: /^[0-9A-Z]{9,10}$/i, companyPattern: /^[0-9A-Z]{9,10}$/i },
  { code: "SX", name: "Sint Maarten", taxHint: "CRIB number", companyHint: "Chamber number" },
  { code: "SK", name: "Slovakia", taxHint: "VAT: SK + 10 digits", companyHint: "ICO, 8 digits", taxPattern: /^SK\d{10}$/i, companyPattern: /^\d{8}$/ },
  { code: "SI", name: "Slovenia", taxHint: "VAT: SI + 8 digits", companyHint: "Registration number", taxPattern: /^SI\d{8}$/i },
  { code: "SB", name: "Solomon Islands", taxHint: "TIN", companyHint: "Company number" },
  { code: "SO", name: "Somalia", taxHint: "TIN", companyHint: "Company number" },
  { code: "ZA", name: "South Africa", taxHint: "VAT, 10 digits", companyHint: "Enterprise number", taxPattern: /^\d{10}$/ },
  { code: "GS", name: "South Georgia and South Sandwich Islands", taxHint: "Tax ID", companyHint: "Organization ID" },
  { code: "SS", name: "South Sudan", taxHint: "TIN", companyHint: "Company registry" },
  { code: "ES", name: "Spain", taxHint: "VAT: ES + 9 chars", companyHint: "CIF/NIF", taxPattern: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/i },
  { code: "LK", name: "Sri Lanka", taxHint: "TIN", companyHint: "Company registration" },
  { code: "SD", name: "Sudan", taxHint: "TIN", companyHint: "Company registry" },
  { code: "SR", name: "Suriname", taxHint: "FIN", companyHint: "Company number" },
  { code: "SJ", name: "Svalbard and Jan Mayen", taxHint: "Norwegian org number", companyHint: "Org nr, 9 digits", companyPattern: /^\d{9}$/ },
  { code: "SE", name: "Sweden", taxHint: "VAT: SE + 12 digits", companyHint: "Org nr, 10 digits", taxPattern: /^SE\d{12}$/i, companyPattern: /^\d{10}$/ },
  { code: "CH", name: "Switzerland", taxHint: "UID: CHE-123.456.789", companyHint: "UID", taxPattern: /^CHE-?\d{3}\.?\d{3}\.?\d{3}(MWST|TVA|IVA)?$/i },
  { code: "SY", name: "Syrian Arab Republic", taxHint: "Tax ID", companyHint: "Company registry" },
  { code: "TW", name: "Taiwan", taxHint: "GUI, 8 digits", companyHint: "Company ID, 8 digits", taxPattern: /^\d{8}$/, companyPattern: /^\d{8}$/ },
  { code: "TJ", name: "Tajikistan", taxHint: "TIN, 9 digits", companyHint: "EIN", taxPattern: /^\d{9}$/ },
  { code: "TZ", name: "Tanzania", taxHint: "TIN, 9 digits", companyHint: "Company number", taxPattern: /^\d{9}$/ },
  { code: "TH", name: "Thailand", taxHint: "TIN, 13 digits", companyHint: "Juristic ID, 13 digits", taxPattern: /^\d{13}$/, companyPattern: /^\d{13}$/ },
  { code: "TL", name: "Timor-Leste", taxHint: "TIN", companyHint: "Company number" },
  { code: "TG", name: "Togo", taxHint: "NIF", companyHint: "RCCM" },
  { code: "TK", name: "Tokelau", taxHint: "Tax ID", companyHint: "Company number" },
  { code: "TO", name: "Tonga", taxHint: "TIN", companyHint: "Company number" },
  { code: "TT", name: "Trinidad and Tobago", taxHint: "BIR number", companyHint: "Company number" },
  { code: "TN", name: "Tunisia", taxHint: "MF, 7 digits + letters", companyHint: "RNE", taxPattern: /^\d{7}[A-Z]{1,4}$/i },
  { code: "TR", name: "Türkiye", taxHint: "VKN, 10 digits", companyHint: "MERSIS, 16 digits", taxPattern: /^\d{10}$/, companyPattern: /^\d{16}$/ },
  { code: "TM", name: "Turkmenistan", taxHint: "Tax ID", companyHint: "Registry number" },
  { code: "TC", name: "Turks and Caicos Islands", taxHint: "TIN", companyHint: "Company number" },
  { code: "TV", name: "Tuvalu", taxHint: "TIN", companyHint: "Company number" },
  { code: "UG", name: "Uganda", taxHint: "TIN, 10 chars", companyHint: "Registration number", taxPattern: /^\d{10}$/ },
  { code: "UA", name: "Ukraine", taxHint: "EDRPOU, 8 digits", companyHint: "EDRPOU", taxPattern: /^\d{8,10}$/, companyPattern: /^\d{8}$/ },
  { code: "AE", name: "United Arab Emirates", taxHint: "TRN, 15 digits", companyHint: "Trade license", taxPattern: /^\d{15}$/ },
  { code: "GB", name: "United Kingdom", taxHint: "VAT: GB + 9/12 digits", companyHint: "Company number, 8 chars", taxPattern: /^GB\d{9}(\d{3})?$/i, companyPattern: /^[A-Z0-9]{8}$/i },
  { code: "US", name: "United States", taxHint: "EIN, 9 digits", companyHint: "State/company file number", taxPattern: /^\d{2}-?\d{7}$/ },
  { code: "UM", name: "United States Minor Outlying Islands", taxHint: "EIN/TIN", companyHint: "Entity number", taxPattern: /^\d{2}-?\d{7}$/ },
  { code: "UY", name: "Uruguay", taxHint: "RUT, 12 digits", companyHint: "RUT", taxPattern: /^\d{12}$/ },
  { code: "UZ", name: "Uzbekistan", taxHint: "TIN, 9 digits", companyHint: "OKED/company ID", taxPattern: /^\d{9}$/ },
  { code: "VU", name: "Vanuatu", taxHint: "TIN", companyHint: "Company number" },
  { code: "VE", name: "Venezuela", taxHint: "RIF, letter + 9 digits", companyHint: "RIF", taxPattern: /^[JGVEP]-?\d{8}-?\d$/i },
  { code: "VN", name: "Viet Nam", taxHint: "MST, 10-13 digits", companyHint: "Enterprise code", taxPattern: /^\d{10}(\d{3})?$/ },
  { code: "VG", name: "Virgin Islands, British", taxHint: "TIN", companyHint: "Company number" },
  { code: "VI", name: "Virgin Islands, U.S.", taxHint: "EIN/TIN", companyHint: "Entity number", taxPattern: /^\d{2}-?\d{7}$/ },
  { code: "WF", name: "Wallis and Futuna", taxHint: "Tax ID", companyHint: "Registry number" },
  { code: "EH", name: "Western Sahara", taxHint: "Tax ID", companyHint: "Registry number" },
  { code: "YE", name: "Yemen", taxHint: "Tax ID", companyHint: "Commercial registry" },
  { code: "ZM", name: "Zambia", taxHint: "TPIN, 10 digits", companyHint: "PACRA number", taxPattern: /^\d{10}$/ },
  { code: "ZW", name: "Zimbabwe", taxHint: "BP number", companyHint: "Company number" },
];

const normalize = (value: string) => value.trim().replace(/\s+/g, "").toUpperCase();
const VALIDATION_API_URL = import.meta.env.VITE_VALIDATION_API_URL || "https://api.taxidverify.smartchance.org/validate";

const validateField = (value: string, pattern?: RegExp) => {
  const normalized = normalize(value);
  if (!normalized) return { label: "Not provided", valid: false, tone: "muted" as const };
  if (!pattern) {
    return normalized.length >= 4
      ? { label: "Format looks plausible", valid: true, tone: "info" as const }
      : { label: "Too short to validate", valid: false, tone: "warning" as const };
  }
  return pattern.test(normalized)
    ? { label: "Format matches", valid: true, tone: "success" as const }
    : { label: "Format does not match", valid: false, tone: "warning" as const };
};

const Index = () => {
  const [countryCode, setCountryCode] = useState("US");
  const [taxId, setTaxId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [apiError, setApiError] = useState<string>("");

  const selectedCountry = useMemo(
    () => countries.find((country) => country.code === countryCode) ?? countries[0],
    [countryCode]
  );

  const taxResult = validateField(taxId, selectedCountry.taxPattern);
  const companyResult = validateField(companyId, selectedCountry.companyPattern);
  const hasInput = normalize(taxId) || normalize(companyId);
  const passed =
    hasInput &&
    (!normalize(taxId) || taxResult.valid) &&
    (!normalize(companyId) || companyResult.valid) &&
    (submitted ? apiResult?.valid !== false : true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
    setApiResult(null);
    setApiError("");

    if (!hasInput) return;

    const payload = {
      country: selectedCountry.code,
      company_id: normalize(companyId) || null,
      tax_id: normalize(taxId) || null,
    };

    setIsLoading(true);

    try {
      const response = await fetch(VALIDATION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ApiResult = await response.json().catch(() => null);


      if (!response.ok || data?.valid === false) {
        const message =
          data?.errors?.[0]?.message ||
          `API error ${response.status}`;

        throw new Error(message);
      }

      setApiResult(data);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Validation API request failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-page px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="tax-grid pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/70 blur-3xl motion-safe:animate-float-slow" />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-primary shadow-card backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Global ID format checker
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
              Tax ID & company ID validation
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              Select a country, enter a tax ID, company ID, or both, and get an instant format result.
            </p>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-3">
            {["249 countries", "Tax ID", "Company ID"].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-card/65 p-4 text-center shadow-card backdrop-blur transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-bold text-primary">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/85 p-5 shadow-soft backdrop-blur-xl sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">Validator</p>
                <h2 className="text-2xl font-black text-card-foreground">Check business identifiers</h2>
              </div>
              <div className="rounded-full bg-secondary p-3 text-secondary-foreground">

                <img
                  src={logo}
                  alt="Logo"
                  className="h-6 w-6"
                />

              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-foreground">Country</span>
              <select
                value={countryCode}
                onChange={(event) => {
                  setCountryCode(event.target.value);
                  setSubmitted(false);
                }}
                className="h-12 w-full rounded-lg border border-input bg-background px-4 font-semibold text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-bold text-foreground">Tax ID</span>
                <input
                  value={taxId}
                  onChange={(event) => {
                    setTaxId(event.target.value);
                    setSubmitted(false);
                  }}
                  placeholder={selectedCountry.taxHint}
                  className="h-12 w-full rounded-lg border border-input bg-background px-4 font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold text-foreground">Company ID</span>
                <input
                  value={companyId}
                  onChange={(event) => {
                    setCompanyId(event.target.value);
                    setSubmitted(false);
                  }}
                  placeholder={selectedCountry.companyHint}
                  className="h-12 w-full rounded-lg border border-input bg-background px-4 font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-5 font-black text-primary-foreground shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card focus:outline-none focus:ring-4 focus:ring-ring/25"
            >
              <FileSearch className="h-5 w-5 transition-transform group-hover:scale-110" />
              {isLoading ? "Validating..." : "Submit validation"}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-border bg-background/80 p-4">
            {!submitted ? (
              <div className="flex items-start gap-3 text-muted-foreground">
                <CircleAlert className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-sm leading-6">Results will appear here after you submit. Enter either field or both.</p>
              </div>
            ) : !hasInput ? (
              <div className="flex items-start gap-3 text-warning">
                <CircleAlert className="mt-0.5 h-5 w-5" />
                <p className="text-sm font-semibold leading-6">Please enter a tax ID, company ID, or both before submitting.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`flex items-center gap-2 font-black ${passed ? "text-success" : "text-warning"}`}>
                  {passed ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}
                  {passed ? "Validation passed" : "Review needed"}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultCard label="Tax ID" value={taxId} result={taxResult} hint={selectedCountry.taxHint} />
                  <ResultCard label="Company ID" value={companyId} result={companyResult} hint={selectedCountry.companyHint} />
                </div>
                <div className="rounded-lg border border-border bg-card p-4 shadow-card">
                  <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">API validation</p>
                  {isLoading ? (
                    <p className="mt-2 text-sm font-bold text-info">Sending country_code, company_id, and tax_id...</p>
                  ) : apiResult ? (
                    apiResult.valid ? (
                      <p className="mt-2 text-sm font-bold text-success">
                        API validation passed
                      </p>
                    ) : (
                      <p className="mt-2 text-sm font-bold text-warning">
                        {apiResult.errors?.[0]?.message || "API validation failed"}
                      </p>
                    )
                  ) : (
                    <p className="mt-2 text-sm font-bold text-muted-foreground">
                      Waiting for API response.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

const ResultCard = ({
  label,
  value,
  result,
  hint,
}: {
  label: string;
  value: string;
  result: ReturnType<typeof validateField>;
  hint: string;
}) => {
  const toneClass = result.tone === "success" ? "text-success" : result.tone === "warning" ? "text-warning" : "text-info";

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-bold text-card-foreground">{normalize(value) || "—"}</p>
      <p className={`mt-3 text-sm font-black ${toneClass}`}>{result.label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">Expected: {hint}</p>
    </div>
  );
};

export default Index;