import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { buildChecklistContent } from './_pdf-data.js';

const colors = {
  ink: '#0B1726',
  green: '#0F8A6A',
  darkGreen: '#064E3B',
  mint: '#EEF7F1',
  line: '#DDE8DF',
  paper: '#FFFCF6',
  muted: '#526170',
};

const styles = StyleSheet.create({
  page: { padding: 46, backgroundColor: colors.paper, color: colors.ink, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.55 },
  cover: { alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  avatar: { width: 128, height: 128, borderRadius: 64, objectFit: 'cover', objectPosition: 'top', border: `2 solid ${colors.line}`, backgroundColor: colors.mint },
  eyebrow: { marginTop: 22, color: colors.green, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { marginTop: 10, fontSize: 28, lineHeight: 1.15, fontWeight: 700, color: colors.ink },
  subtitle: { marginTop: 14, maxWidth: 420, color: colors.muted, fontSize: 12 },
  chip: { marginTop: 18, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.mint, color: colors.darkGreen, fontWeight: 700 },
  pageTitle: { fontSize: 22, fontWeight: 700, color: colors.ink },
  pageIntro: { marginTop: 8, marginBottom: 20, color: colors.muted, fontSize: 11 },
  card: { marginBottom: 14, padding: 16, borderRadius: 12, border: `1 solid ${colors.line}`, backgroundColor: '#FFFFFF' },
  cardTitle: { marginBottom: 6, color: colors.green, fontSize: 11, fontWeight: 700 },
  heading: { marginTop: 12, marginBottom: 8, fontSize: 13, fontWeight: 700 },
  row: { flexDirection: 'row', marginBottom: 7 },
  bullet: { width: 16, color: colors.green, fontWeight: 700 },
  rowText: { flex: 1 },
  timelineNumber: { width: 24, height: 24, marginRight: 10, borderRadius: 12, backgroundColor: colors.green, color: '#FFFFFF', textAlign: 'center', paddingTop: 4, fontWeight: 700 },
  timelineText: { flex: 1, paddingTop: 4 },
  link: { color: colors.green, textDecoration: 'none', fontSize: 9 },
  warning: { marginTop: 18, padding: 16, borderRadius: 12, backgroundColor: colors.mint, color: colors.darkGreen },
  disclaimer: { marginTop: 18, padding: 18, borderRadius: 12, border: `1 solid ${colors.line}`, backgroundColor: '#FFFFFF', fontSize: 11, lineHeight: 1.65 },
  legalLinks: { marginTop: 12, flexDirection: 'row', gap: 14 },
  footer: { position: 'absolute', left: 46, right: 46, bottom: 28, flexDirection: 'row', justifyContent: 'space-between', color: colors.muted, fontSize: 8 },
});

export function ResidenceChecklistPDF({ applicantData, avatarSource }) {
  const content = buildChecklistContent(applicantData);
  return _jsxs(Document, {
    title: 'Your Residence Checklist for Slovakia',
    author: 'Riadence',
    subject: 'General residence checklist information for Slovakia',
    children: [
      _jsxs(Page, { size: 'A4', style: [styles.page, styles.cover], children: [
        _jsx(Image, { src: avatarSource, style: styles.avatar }),
        _jsx(Text, { style: styles.eyebrow, children: 'Riadence · prepared with Ria' }),
        _jsx(Text, { style: styles.title, children: 'Your Residence Checklist for Slovakia' }),
        _jsxs(Text, { style: styles.subtitle, children: ['Prepared for ', content.preparedFor, ' from ', applicantData.nationality, '. This checklist organizes your likely route, document plan, timeline, and official places to verify.'] }),
        _jsx(Text, { style: styles.chip, children: content.routeTitle }),
        _jsx(Text, { style: styles.warning, children: 'I am not a lawyer. This is general information, not legal advice.' }),
        _jsx(PageFooter, { pageNumber: 1 }),
      ] }),
      _jsxs(Page, { size: 'A4', style: styles.page, children: [
        _jsx(Text, { style: styles.pageTitle, children: 'Your route' }),
        _jsx(Text, { style: styles.pageIntro, children: 'A structured summary based on the answers you gave Riadence.' }),
        _jsxs(View, { style: styles.card, children: [
          _jsx(Text, { style: styles.cardTitle, children: 'Likely route' }),
          _jsx(Text, { children: content.routeTitle }),
          _jsx(Text, { style: styles.heading, children: 'Why this route may fit' }),
          _jsx(Text, { children: content.routeSummary }),
        ] }),
        _jsxs(View, { style: styles.card, children: [
          _jsx(Text, { style: styles.cardTitle, children: 'Your situation' }),
          _jsxs(Text, { children: ['Purpose: ', applicantData.purpose || 'Not specified'] }),
          _jsxs(Text, { children: ['Current status: ', applicantData.statusReason || 'Not specified'] }),
          _jsxs(Text, { children: ['Current location: ', applicantData.currentLocation || 'Not specified'] }),
          _jsxs(Text, { children: ['Main concern: ', applicantData.concern || 'Not specified'] }),
        ] }),
        _jsx(Text, { style: styles.heading, children: 'Documents to prepare or verify' }),
        content.documentsNeeded.map((document) => _jsx(Bullet, { children: document }, document)),
        _jsx(PageFooter, { pageNumber: 2 }),
      ] }),
      _jsxs(Page, { size: 'A4', style: styles.page, children: [
        _jsx(Text, { style: styles.pageTitle, children: 'Practical timeline' }),
        _jsx(Text, { style: styles.pageIntro, children: 'Use this as an ordering guide, not as a guaranteed government processing timeline.' }),
        content.timeline.map((item, index) => _jsxs(View, { style: [styles.card, styles.row], wrap: false, children: [
          _jsx(Text, { style: styles.timelineNumber, children: index + 1 }),
          _jsx(Text, { style: styles.timelineText, children: item }),
        ] }, item)),
        _jsx(View, { style: styles.warning, children: _jsx(Text, { children: 'Translation, apostille, legalization, document-age, and appointment rules can change. Check each item again before filing.' }) }),
        _jsx(PageFooter, { pageNumber: 3 }),
      ] }),
      _jsxs(Page, { size: 'A4', style: styles.page, children: [
        _jsx(Text, { style: styles.pageTitle, children: 'Where to verify and where to go' }),
        _jsx(Text, { style: styles.pageIntro, children: 'Start with official Slovak sources and the Slovak diplomatic mission responsible for your place of residence.' }),
        content.officialResources.map((resource) => _jsxs(View, { style: styles.card, wrap: false, children: [
          _jsx(Text, { style: styles.cardTitle, children: resource.label }),
          _jsx(Link, { src: resource.url, style: styles.link, children: resource.url }),
        ] }, resource.url)),
        _jsx(Text, { style: styles.heading, children: 'Emergency contacts in Slovakia' }),
        content.emergencyContacts.map((contact) => _jsx(Bullet, { children: contact }, contact)),
        _jsx(Text, { style: styles.warning, children: 'Emergency numbers are for urgent situations. They do not provide immigration or legal advice.' }),
        _jsx(PageFooter, { pageNumber: 4 }),
      ] }),
      _jsxs(Page, { size: 'A4', style: styles.page, children: [
        _jsx(Text, { style: styles.pageTitle, children: 'Important disclaimer' }),
        _jsx(Text, { style: styles.pageIntro, children: 'Read this before relying on the checklist or sharing it with someone else.' }),
        _jsx(Text, { style: styles.disclaimer, children: content.disclaimer }),
        _jsxs(View, { style: styles.legalLinks, children: [
          _jsx(Link, { src: 'https://riadence.com/privacy', style: styles.link, children: 'Privacy Policy' }),
          _jsx(Link, { src: 'https://riadence.com/terms', style: styles.link, children: 'Terms of Service' }),
        ] }),
        _jsxs(View, { style: styles.card, children: [
          _jsx(Text, { style: styles.cardTitle, children: 'What Riadence does' }),
          _jsx(Text, { children: 'Riadence organizes the information you provide into a practical checklist. Ria can explain general concepts in plain English and help you prepare questions.' }),
        ] }),
        _jsxs(View, { style: styles.card, children: [
          _jsx(Text, { style: styles.cardTitle, children: 'What Riadence does not do' }),
          _jsx(Text, { children: 'Riadence does not file applications, represent you, create a lawyer-client relationship, or guarantee any visa or residence outcome.' }),
        ] }),
        _jsxs(Text, { style: styles.warning, children: ['Information checked on ', content.verifiedDate, '. Rules and official procedures may change after this date.'] }),
        _jsx(PageFooter, { pageNumber: 5 }),
      ] }),
    ],
  });
}

function Bullet({ children }) {
  return _jsxs(View, { style: styles.row, children: [
    _jsx(Text, { style: styles.bullet, children: '•' }),
    _jsx(Text, { style: styles.rowText, children }),
  ] });
}

function PageFooter({ pageNumber }) {
  return _jsxs(View, { style: styles.footer, fixed: true, children: [
    _jsx(Text, { children: 'Riadence · Your residence guide for Slovakia' }),
    _jsxs(Text, { children: [pageNumber, ' / 5'] }),
  ] });
}
