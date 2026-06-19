import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';
import riaGuide from '../assets/ria-guide-half.png';
import {
  buildChecklistContent,
  type ChecklistApplicantData,
} from './pdf-data';

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
  page: {
    padding: 46,
    backgroundColor: colors.paper,
    color: colors.ink,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.55,
  },
  cover: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    objectFit: 'cover',
    objectPosition: 'top',
    border: `2 solid ${colors.line}`,
    backgroundColor: colors.mint,
  },
  eyebrow: {
    marginTop: 22,
    color: colors.green,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    lineHeight: 1.15,
    fontWeight: 700,
    color: colors.ink,
  },
  subtitle: {
    marginTop: 14,
    maxWidth: 420,
    color: colors.muted,
    fontSize: 12,
  },
  chip: {
    marginTop: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.mint,
    color: colors.darkGreen,
    fontWeight: 700,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.ink,
  },
  pageIntro: {
    marginTop: 8,
    marginBottom: 20,
    color: colors.muted,
    fontSize: 11,
  },
  card: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 12,
    border: `1 solid ${colors.line}`,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    marginBottom: 6,
    color: colors.green,
    fontSize: 11,
    fontWeight: 700,
  },
  heading: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  bullet: {
    width: 16,
    color: colors.green,
    fontWeight: 700,
  },
  rowText: {
    flex: 1,
  },
  timelineNumber: {
    width: 24,
    height: 24,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: colors.green,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingTop: 4,
    fontWeight: 700,
  },
  timelineText: {
    flex: 1,
    paddingTop: 4,
  },
  link: {
    color: colors.green,
    textDecoration: 'none',
    fontSize: 9,
  },
  warning: {
    marginTop: 18,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.mint,
    color: colors.darkGreen,
  },
  disclaimer: {
    marginTop: 18,
    padding: 18,
    borderRadius: 12,
    border: `1 solid ${colors.line}`,
    backgroundColor: '#FFFFFF',
    fontSize: 11,
    lineHeight: 1.65,
  },
  footer: {
    position: 'absolute',
    left: 46,
    right: 46,
    bottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: colors.muted,
    fontSize: 8,
  },
});

export function ResidenceChecklistPDF({
  applicantData,
}: {
  applicantData: ChecklistApplicantData;
}) {
  const content = buildChecklistContent(applicantData);

  return (
    <Document
      title="Your Residence Checklist for Slovakia"
      author="Riadence"
      subject="General residence checklist information for Slovakia"
    >
      <Page size="A4" style={[styles.page, styles.cover]}>
        <Image src={riaGuide} style={styles.avatar} />
        <Text style={styles.eyebrow}>Riadence · prepared with Ria</Text>
        <Text style={styles.title}>Your Residence Checklist for Slovakia</Text>
        <Text style={styles.subtitle}>
          Prepared for {content.preparedFor} from {applicantData.nationality}. This checklist organizes your
          likely route, document plan, timeline, and official places to verify.
        </Text>
        <Text style={styles.chip}>{content.routeTitle}</Text>
        <Text style={styles.warning}>I am not a lawyer. This is general information, not legal advice.</Text>
        <PageFooter pageNumber={1} />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Your route</Text>
        <Text style={styles.pageIntro}>A structured summary based on the answers you gave Riadence.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Likely route</Text>
          <Text>{content.routeTitle}</Text>
          <Text style={styles.heading}>Why this route may fit</Text>
          <Text>{content.routeSummary}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your situation</Text>
          <Text>Purpose: {applicantData.purpose || 'Not specified'}</Text>
          <Text>Current status: {applicantData.statusReason || 'Not specified'}</Text>
          <Text>Current location: {applicantData.currentLocation || 'Not specified'}</Text>
          <Text>Main concern: {applicantData.concern || 'Not specified'}</Text>
        </View>
        <Text style={styles.heading}>Documents to prepare or verify</Text>
        {content.documentsNeeded.map((document) => (
          <Bullet key={document}>{document}</Bullet>
        ))}
        <PageFooter pageNumber={2} />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Practical timeline</Text>
        <Text style={styles.pageIntro}>
          Use this as an ordering guide, not as a guaranteed government processing timeline.
        </Text>
        {content.timeline.map((item, index) => (
          <View key={item} style={[styles.card, styles.row]} wrap={false}>
            <Text style={styles.timelineNumber}>{index + 1}</Text>
            <Text style={styles.timelineText}>{item}</Text>
          </View>
        ))}
        <View style={styles.warning}>
          <Text>
            Translation, apostille, legalization, document-age, and appointment rules can change. Check each item
            again before filing.
          </Text>
        </View>
        <PageFooter pageNumber={3} />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Where to verify and where to go</Text>
        <Text style={styles.pageIntro}>
          Start with official Slovak sources and the Slovak diplomatic mission responsible for your place of
          residence.
        </Text>
        {content.officialResources.map((resource) => (
          <View key={resource.url} style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>{resource.label}</Text>
            <Link src={resource.url} style={styles.link}>
              {resource.url}
            </Link>
          </View>
        ))}
        <Text style={styles.heading}>Emergency contacts in Slovakia</Text>
        {content.emergencyContacts.map((contact) => (
          <Bullet key={contact}>{contact}</Bullet>
        ))}
        <Text style={styles.warning}>
          Emergency numbers are for urgent situations. They do not provide immigration or legal advice.
        </Text>
        <PageFooter pageNumber={4} />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Important disclaimer</Text>
        <Text style={styles.pageIntro}>Read this before relying on the checklist or sharing it with someone else.</Text>
        <Text style={styles.disclaimer}>{content.disclaimer}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Riadence does</Text>
          <Text>
            Riadence organizes the information you provide into a practical checklist. Ria can explain general
            concepts in plain English and help you prepare questions.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Riadence does not do</Text>
          <Text>
            Riadence does not file applications, represent you, create a lawyer-client relationship, or guarantee any
            visa or residence outcome.
          </Text>
        </View>
        <Text style={styles.warning}>
          Information checked on {content.verifiedDate}. Rules and official procedures may change after this date.
        </Text>
        <PageFooter pageNumber={5} />
      </Page>
    </Document>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.rowText}>{children}</Text>
    </View>
  );
}

function PageFooter({ pageNumber }: { pageNumber: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Riadence · Your residence guide for Slovakia</Text>
      <Text>{pageNumber} / 5</Text>
    </View>
  );
}

export async function generateChecklistPdf(
  applicantData: ChecklistApplicantData,
): Promise<Blob> {
  return pdf(<ResidenceChecklistPDF applicantData={applicantData} />).toBlob();
}
