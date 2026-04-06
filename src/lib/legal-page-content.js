/**
 * Static content for all legal pages
 * Used by each legal page's static route (src/app/[slug]/page.jsx)
 */

export const LEGAL_PAGE_DATA = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How Healsend collects, uses, and protects your personal and health information.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "pp-intro",
        title: "1. Introduction & Roles",
        summary: null,
        html: `<p><strong>Last Updated: January 1, 2025 | Effective Date: January 1, 2025</strong></p>
<p>Healsend LLC ("Healsend," "we," "us," "our") operates as a Management Services Organization (MSO). We provide technology infrastructure and administrative services to a network of licensed independent Professional Entities — physician groups and other healthcare providers — that deliver clinical care to patients.</p>
<p><strong>We are a technology and administrative services company, not a medical provider.</strong> Healsend does not practice medicine, does not employ licensed clinicians in a clinical capacity, and is not a covered entity under HIPAA with respect to most data processing activities. The Professional Entities we support may be covered entities or business associates subject to HIPAA, and we serve as a business associate under those arrangements.</p>
<p>This Privacy Policy applies to information collected through healsend.com and all associated applications, platforms, and services (collectively, the "Platform").</p>`,
      },
      {
        id: "pp-scope",
        title: "2. Scope & Applicability",
        summary: null,
        html: `<p>This Policy applies to all individuals who:</p>
<ul>
<li>Visit or interact with our website or Platform</li>
<li>Create an account or register as a patient</li>
<li>Complete health intake questionnaires or consultations</li>
<li>Purchase or use any service or product through the Platform</li>
<li>Contact us for support or information</li>
</ul>
<p>This Policy does <strong>not</strong> apply to information processed exclusively by Professional Entities in their independent capacity as covered entities. Patients seeking access to their Protected Health Information (PHI) held by their treating provider should contact that provider directly or submit a HIPAA request to Healsend's Privacy Officer (see Section 10).</p>
<p>Our services are available only to residents of the United States who are 18 years of age or older.</p>`,
      },
      {
        id: "pp-definitions",
        title: "3. Key Definitions",
        summary: null,
        html: `<p>The following terms are used throughout this Policy:</p>
<ul>
<li><strong>Personal Information (PI):</strong> Any information that identifies, relates to, or could reasonably be linked to you directly or indirectly.</li>
<li><strong>Consumer Health Data (CHD):</strong> Personal information that identifies your past, present, or future physical or mental health condition, including health history, diagnoses, medications, and related data regulated under state consumer health data laws such as Washington's My Health My Data Act.</li>
<li><strong>Sensitive Personal Information (SPI):</strong> A subset of PI including SSN/government ID, financial account details, health information, sexual orientation/gender identity, biometric data, and precise geolocation. SPI receives the highest level of protection under this Policy.</li>
<li><strong>Protected Health Information (PHI):</strong> Health information created or received by a HIPAA-covered entity or business associate that is identifiable and relates to health condition, care, or payment.</li>
<li><strong>Professional Entity:</strong> Licensed physician groups and healthcare providers supported by Healsend's MSO services that independently provide clinical care to patients.</li>
<li><strong>Service Provider / Business Associate:</strong> Entities that process data on behalf of Healsend or Professional Entities under contractual obligations limiting their use of data.</li>
</ul>`,
      },
      {
        id: "pp-data-collection",
        title: "4. Data We Collect",
        summary: null,
        html: `<p>We collect the following categories of information depending on how you interact with the Platform:</p>
<h3>Identifiers & Contact Information</h3>
<ul>
<li>Name, email address, phone number, mailing address, date of birth</li>
<li>Username and account credentials (passwords stored as salted hashes)</li>
<li>IP address, device ID, session tokens</li>
</ul>
<h3>Health & Medical Information</h3>
<ul>
<li>Health intake questionnaire responses (symptoms, medical history, medications, allergies)</li>
<li>Consultation notes and treatment preferences entered on the Platform</li>
<li>Lab results or medical records you upload or authorize providers to share</li>
<li>Weight, body measurements, and other biometric data you provide</li>
</ul>
<h3>Financial Information</h3>
<ul>
<li>Payment card details (processed by PCI-DSS compliant third-party processors; we store only tokenized card references)</li>
<li>Billing address, transaction history</li>
</ul>
<h3>Technical & Usage Data</h3>
<ul>
<li>Browser type, operating system, referring URLs</li>
<li>Pages visited, features used, time on Platform, click patterns</li>
<li>Cookie and tracking pixel data (see Section 9)</li>
</ul>
<h3>Communications</h3>
<ul>
<li>Messages you send to support, providers, or pharmacies through the Platform</li>
<li>Survey responses and feedback submissions</li>
</ul>`,
      },
      {
        id: "pp-purposes",
        title: "5. How We Use Your Information",
        summary: null,
        html: `<p>We process your information for the following purposes:</p>
<ul>
<li><strong>Account Management:</strong> Creating and maintaining your account, authenticating your identity, processing account changes.</li>
<li><strong>Facilitating Telehealth Services:</strong> Routing your intake data to the appropriate Professional Entity, enabling asynchronous or synchronous consultations, coordinating care pathways.</li>
<li><strong>Payment Processing:</strong> Billing subscription fees, processing one-time charges, managing refunds and payment disputes.</li>
<li><strong>Prescription Coordination:</strong> Transmitting prescriptions to partner pharmacies (including compounding pharmacies), tracking order and shipment status.</li>
<li><strong>Platform Improvement & Analytics:</strong> Analyzing usage patterns to improve user experience, debugging technical issues, testing new features.</li>
<li><strong>Marketing & Communications:</strong> Sending appointment reminders, treatment updates, and (where consented) promotional content. You may opt out of marketing communications at any time.</li>
<li><strong>Legal Compliance & Fraud Prevention:</strong> Fulfilling regulatory obligations, defending legal claims, detecting and preventing fraudulent or unauthorized activity.</li>
<li><strong>Safety Monitoring:</strong> Monitoring for adverse events related to prescribed treatments and escalating safety concerns to appropriate providers.</li>
</ul>`,
      },
      {
        id: "pp-disclosures",
        title: "6. How We Share Your Information",
        summary: null,
        html: `<p>We do not sell your personal information. We share information only in the following circumstances:</p>
<ul>
<li><strong>Professional Entities:</strong> Your intake information and health data is shared with the licensed provider group assigned to review your case. The Professional Entity may retain this data as PHI under their own HIPAA obligations.</li>
<li><strong>Pharmacies & Fulfillment Partners:</strong> Prescription details are transmitted to licensed compounding or retail pharmacies to fulfill your treatment plan.</li>
<li><strong>Service Providers:</strong> Third-party vendors who provide infrastructure, payment processing, identity verification, analytics, customer support, or marketing services operate under contractual obligations restricting their use of your data to performing services for us.</li>
<li><strong>Affiliates:</strong> We may share information with corporate affiliates under this same Privacy Policy.</li>
<li><strong>Legal & Regulatory Authorities:</strong> We may disclose information to comply with valid legal process (subpoenas, court orders), to prevent imminent harm, or to report suspected illegal activity.</li>
<li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the successor entity subject to the same protections described here.</li>
</ul>`,
      },
      {
        id: "pp-rights",
        title: "7. Your Privacy Rights",
        summary: null,
        html: `<p>Depending on your state of residence, you may have the following rights with respect to your personal information:</p>
<ul>
<li><strong>Right to Know / Access:</strong> Request a copy of the personal information we hold about you and how it is used.</li>
<li><strong>Right to Correction:</strong> Request that we correct inaccurate personal information.</li>
<li><strong>Right to Deletion:</strong> Request deletion of your personal information, subject to legal retention obligations.</li>
<li><strong>Right to Data Portability:</strong> Request your information in a structured, machine-readable format.</li>
<li><strong>Right to Opt Out of Sale / Sharing:</strong> We do not sell or share personal information for cross-context behavioral advertising. If this changes, you will be notified and provided an opt-out mechanism.</li>
<li><strong>Right to Restrict Sensitive Data Processing:</strong> Request that we limit use of your sensitive personal information to strictly necessary purposes.</li>
<li><strong>Right to Non-Discrimination:</strong> We will not deny services, charge different prices, or provide a lower quality of service because you exercised a privacy right.</li>
<li><strong>Right to Appeal:</strong> If we deny your request, you may appeal to our Privacy Officer within 45 days.</li>
</ul>
<p>To exercise these rights, contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> or submit a request through our Platform settings. We will verify your identity before processing requests.</p>`,
      },
      {
        id: "pp-state-rights",
        title: "8. State-Specific Rights",
        summary: null,
        html: `<h3>California (CCPA / CPRA)</h3>
<p>California residents have the rights described in Section 7 plus the right to opt out of sharing for cross-context behavioral advertising. We do not have actual knowledge that we sell or share the personal information of consumers under 16 years of age. California residents may contact our Privacy Officer to exercise CCPA rights.</p>
<h3>Washington (My Health My Data Act)</h3>
<p>Washington residents have additional rights regarding Consumer Health Data. We obtain explicit consent before collecting, sharing, or selling consumer health data unless a legal exemption applies. Washington residents may request a list of all third parties with whom their consumer health data has been shared. See our <a href="/consumer-health-data">Consumer Health Data Policy</a> for details.</p>
<h3>Other States</h3>
<p>Residents of Colorado, Connecticut, Iowa, Montana, Oregon, Texas, Utah, and Virginia have rights including access, correction, deletion, portability, and opt-out of targeted advertising, profiling, and sale of personal data. To exercise these rights, contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>.</p>`,
      },
      {
        id: "pp-security",
        title: "9. Data Security & Retention",
        summary: null,
        html: `<h3>Security Program</h3>
<p>We maintain a comprehensive information security program that includes:</p>
<ul>
<li>TLS 1.3 encryption for all data in transit</li>
<li>AES-256 encryption for data at rest</li>
<li>Multi-factor authentication (MFA) for administrative access</li>
<li>Role-based access controls limiting data access to personnel with a legitimate need</li>
<li>Annual third-party penetration testing and vulnerability assessments</li>
<li>Security incident response plan with 72-hour breach notification capability</li>
</ul>
<h3>Cookies & Tracking</h3>
<p>We use essential cookies for Platform functionality, analytics cookies to understand usage, and (with consent) marketing cookies to personalize communications. You may manage cookie preferences through our cookie banner or browser settings. We honor Global Privacy Control (GPC) signals as opt-out requests.</p>
<h3>Retention</h3>
<p>We retain personal information for as long as your account is active, plus a reasonable period to fulfill legal obligations, resolve disputes, and enforce agreements. Health-related records are generally retained for 7 years after last activity or as required by applicable state law. You may request deletion subject to these obligations.</p>`,
      },
      {
        id: "pp-contact",
        title: "10. Contact & Updates",
        summary: null,
        html: `<p>To exercise privacy rights, ask questions, or submit complaints, contact our Privacy Officer:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></li>
<li><strong>Mail:</strong> Privacy Officer, Healsend LLC, 30 N Gould St Ste R, Sheridan, WY 82801</li>
</ul>
<p>We respond to verifiable requests within 45 days. For complex requests, we may extend this period by an additional 45 days with written notice.</p>
<h3>Policy Updates</h3>
<p>We may update this Policy from time to time. Material changes will be communicated by posting a prominent notice on the Platform and updating the "Last Updated" date at the top of this Policy. Continued use of the Platform after notice constitutes acceptance of the revised Policy.</p>`,
      },
    ],
  },

  "consent-to-telehealth-2": {
    slug: "consent-to-telehealth-2",
    title: "Consent to Telehealth",
    description:
      "Your rights and acknowledgments regarding telehealth services delivered through the Healsend platform.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "tele-purpose",
        title: "1. Purpose & Scope",
        summary: null,
        html: `<p><strong>Last Updated: January 1, 2025</strong></p>
<p>This Consent to Telehealth ("Consent") governs your use of telehealth services facilitated by Healsend LLC ("Healsend"), a Management Services Organization (MSO). Healsend does not practice medicine. Licensed Professional Entities — independent physician groups and other clinicians — deliver all clinical care. By accessing the Platform and requesting a consultation, you acknowledge reading and agreeing to this Consent.</p>
<p>This Consent should be read alongside our <a href="/privacy-policy">Privacy Policy</a>, <a href="/terms-of-service-2">Terms of Service</a>, and any state-specific notices provided during enrollment.</p>`,
      },
      {
        id: "tele-nature",
        title: "2. Nature of Telehealth",
        summary: null,
        html: `<p>Telehealth involves the delivery of healthcare services using telecommunications technology. Through the Healsend Platform, services may be delivered via:</p>
<ul>
<li><strong>Asynchronous (Store-and-Forward):</strong> You complete a health intake questionnaire; a licensed provider reviews your responses and issues a clinical determination without a real-time interaction.</li>
<li><strong>Messaging:</strong> Text-based communication between you and your care team through secure Platform messaging.</li>
<li><strong>Synchronous Video:</strong> Live video consultations where available.</li>
<li><strong>Remote Monitoring:</strong> Collection and transmission of health data you enter (e.g., weight, glucose readings) to support ongoing care.</li>
</ul>
<p>Not all modalities are available in all states or for all treatment types. Your provider will inform you of the modality used for your consultation.</p>`,
      },
      {
        id: "tele-parties",
        title: "3. Parties to This Consent",
        summary: null,
        html: `<ul>
<li><strong>Patient / You:</strong> The individual enrolling for telehealth services through the Platform.</li>
<li><strong>Provider:</strong> The individual licensed clinician (physician, PA, NP, or other) assigned to review your case and make clinical determinations.</li>
<li><strong>Professional Entity:</strong> The licensed healthcare group (PC, PA, PLLC) through which the Provider is affiliated and that employs or contracts with the Provider.</li>
<li><strong>Healsend:</strong> The MSO providing technology, administrative support, and platform infrastructure. Healsend is not a party to the patient-provider clinical relationship.</li>
</ul>`,
      },
      {
        id: "tele-benefits-risks",
        title: "4. Benefits, Limitations & Risks",
        summary: null,
        html: `<h3>Benefits</h3>
<ul>
<li>Expanded access to care without geographic barriers</li>
<li>Convenient asynchronous consultations that fit your schedule</li>
<li>Continuity of care for ongoing treatment plans</li>
<li>Reduced time and cost compared to in-person visits</li>
</ul>
<h3>Limitations</h3>
<ul>
<li>Telehealth does not replace an in-person physical examination</li>
<li>Not all medical conditions are appropriate for telehealth assessment</li>
<li>Technical failures may interrupt or delay care</li>
<li>Certain diagnostic tools (blood tests, imaging) require in-person services not available through this Platform</li>
</ul>
<h3>Risks</h3>
<ul>
<li>Incomplete medical information may affect clinical decision-making</li>
<li>Transmission errors or technology failures could delay treatment</li>
<li>Privacy risks inherent in electronic transmission of health data, mitigated by our security program</li>
</ul>
<p>By proceeding, you acknowledge these limitations and confirm that telehealth is an acceptable modality for your current healthcare needs.</p>`,
      },
      {
        id: "tele-representations",
        title: "5. Patient Representations & Provider Responsibilities",
        summary: null,
        html: `<h3>You Represent That You:</h3>
<ul>
<li>Are at least 18 years old and located in a U.S. state where services are offered</li>
<li>Will provide complete, accurate, and truthful responses to all health intake questions</li>
<li>Understand that your clinical outcome depends on the accuracy of information you provide</li>
<li>Have a primary care provider and will not use telehealth services as a replacement for emergency care</li>
<li>Will notify your provider of any changes in your health status, new medications, or adverse reactions</li>
</ul>
<h3>Provider Responsibilities</h3>
<p>Your licensed provider will:</p>
<ul>
<li>Review your intake information before making any clinical determination</li>
<li>Issue prescriptions only when clinically appropriate under applicable professional standards</li>
<li>Coordinate with compounding or retail pharmacies in compliance with applicable law</li>
<li>Maintain clinical records in accordance with HIPAA and state recordkeeping requirements</li>
</ul>`,
      },
      {
        id: "tele-privacy",
        title: "6. Privacy, Security & Patient Rights",
        summary: null,
        html: `<p>Your health information is protected under our <a href="/privacy-policy">Privacy Policy</a> and, where the Professional Entity is a HIPAA covered entity, under the HIPAA Privacy and Security Rules.</p>
<h3>Security Measures</h3>
<ul>
<li>All transmissions are encrypted using TLS 1.3</li>
<li>Health data at rest is protected with AES-256 encryption</li>
<li>Access is limited to your treating provider, authorized care team members, and administrative staff on a need-to-know basis</li>
</ul>
<h3>Your Patient Rights</h3>
<ul>
<li>Right to access your medical records</li>
<li>Right to request amendments to your health information</li>
<li>Right to an accounting of disclosures</li>
<li>Right to request restrictions on use and disclosure</li>
<li>Right to receive communications through alternative means</li>
<li>Right to complain to HHS Office for Civil Rights if you believe your HIPAA rights have been violated</li>
</ul>`,
      },
      {
        id: "tele-complaints",
        title: "7. Emergencies, Complaints & Costs",
        summary: null,
        html: `<h3>Emergencies</h3>
<p><strong>If you are experiencing a medical emergency, call 911 immediately or go to the nearest emergency room.</strong> Healsend and associated providers do not provide emergency services. The Platform is not monitored 24/7 for urgent communications.</p>
<h3>Complaints</h3>
<p>To file a complaint about your telehealth experience or a provider's conduct:</p>
<ul>
<li>Contact Healsend Patient Support at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a></li>
<li>Contact your state medical board</li>
<li>File a complaint with HHS OCR at <a href="https://www.hhs.gov/ocr" rel="noopener noreferrer">hhs.gov/ocr</a></li>
</ul>
<h3>Costs</h3>
<p>Services are provided on a self-pay basis. We do not bill insurance. All fees are disclosed prior to checkout. Your subscription or one-time payment covers access to consultations and, where prescribed, treatment plans. Medication costs, when applicable, are itemized separately.</p>`,
      },
      {
        id: "tele-state",
        title: "8. State-Specific Notices",
        summary: null,
        html: `<h3>California</h3>
<p>California patients have the right to receive an itemized statement of charges within a reasonable time. You may request copies of all records maintained in connection with your telehealth services. The Medical Board of California can be reached at (800) 633-2322.</p>
<h3>Florida</h3>
<p>Florida law requires that telehealth providers inform patients of the limitations of telehealth services and provide a referral to an in-person provider when clinically appropriate.</p>
<h3>Texas</h3>
<p>Texas patients must have a valid patient-provider relationship before controlled substances may be prescribed via telehealth. Texas Medical Board at (512) 305-7010.</p>
<h3>Washington</h3>
<p>Washington patients have consumer health data rights described in the <a href="/consumer-health-data">Consumer Health Data Policy</a>. You must provide explicit written consent before consumer health data may be shared with third parties.</p>
<h3>New York</h3>
<p>New York requires that telehealth practitioners maintain a patient record for each telehealth encounter in accordance with the same standards as in-person care.</p>
<h3>Colorado & Virginia</h3>
<p>Patients in these states have additional rights under their respective Consumer Data Protection Acts. Contact us to exercise these rights.</p>`,
      },
      {
        id: "tele-withdrawal",
        title: "9. Acknowledgment & Withdrawal",
        summary: null,
        html: `<p>By accessing the Platform and completing the enrollment process, you acknowledge that:</p>
<ul>
<li>You have read and understood this Consent</li>
<li>You voluntarily agree to receive healthcare services via telehealth</li>
<li>Your electronic acknowledgment constitutes a legally binding consent equivalent to a written signature under applicable e-signature laws (ESIGN Act, UETA)</li>
<li>You understand the benefits, limitations, and risks described in this Consent</li>
</ul>
<h3>Withdrawal</h3>
<p>You may withdraw this Consent at any time by contacting <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> or by closing your account in Platform settings. Withdrawal will prevent future telehealth consultations but will not retroactively affect care already provided. Outstanding prescription shipments may continue processing if already dispensed by the pharmacy.</p>`,
      },
    ],
  },

  "consumer-health-data": {
    slug: "consumer-health-data",
    title: "Consumer Health Data Policy",
    description:
      "How Healsend collects, uses, and protects your consumer health data under state health privacy laws.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "chd-intro",
        title: "1. Purpose & Scope",
        summary: null,
        html: `<p><strong>Last Updated: January 1, 2025</strong></p>
<p>This Consumer Health Data Policy ("Policy") supplements our <a href="/privacy-policy">Privacy Policy</a> and describes how Healsend LLC collects, uses, shares, and protects Consumer Health Data (CHD) as defined under applicable state consumer health data laws.</p>
<p>Healsend operates as a Management Services Organization. Where Healsend processes data as a business associate of a HIPAA-covered Professional Entity, that data is governed by the relevant Business Associate Agreement (BAA) and the Professional Entity's Notice of Privacy Practices. This Policy addresses CHD processed in Healsend's capacity as a technology platform and data controller under state law.</p>`,
      },
      {
        id: "chd-definitions",
        title: "2. Key Definitions",
        summary: null,
        html: `<p>The following definitions apply throughout this Policy:</p>
<ul>
<li><strong>Consumer Health Data (CHD):</strong> Personal information that identifies your past, present, or future physical or mental health status, including diagnoses, medications, health conditions, health-related payments, and bodily functions or characteristics.</li>
<li><strong>Regulated Health Data:</strong> A subset of CHD subject to heightened protection under laws such as Washington's My Health My Data Act (MHMDA), Nevada's SB 370, or Illinois's Biometric Information Privacy Act (BIPA).</li>
<li><strong>Biometric Data:</strong> Data generated from physiological or behavioral characteristics including fingerprints, voiceprints, iris or retinal scans, or face geometry used for identification purposes.</li>
<li><strong>De-identified Data:</strong> Information that has been processed to remove all reasonably linkable identifiers according to recognized standards (HIPAA Expert Determination or Safe Harbor methods).</li>
<li><strong>Business Associate (BA):</strong> An entity that creates, receives, maintains, or transmits PHI on behalf of a HIPAA covered entity under a signed BAA.</li>
<li><strong>Controller vs. Processor:</strong> Healsend acts as a Controller for platform-level data decisions and as a Processor/Business Associate for data it handles on behalf of Professional Entities.</li>
<li><strong>Consent:</strong> A freely given, specific, informed, and unambiguous indication of agreement, obtained separately from general Terms of Service acceptance.</li>
<li><strong>Sale of Health Data:</strong> Exchanging consumer health data for monetary or other valuable consideration not authorized under applicable law or consent.</li>
</ul>`,
      },
      {
        id: "chd-law",
        title: "3. Applicable Legal Frameworks",
        summary: null,
        html: `<p>Healsend's handling of consumer health data is governed by multiple overlapping legal frameworks:</p>
<ul>
<li><strong>HIPAA / HITECH:</strong> Where Healsend acts as a business associate of a covered entity, PHI is governed by HIPAA Privacy and Security Rules and our BAA. HITECH breach notification obligations apply.</li>
<li><strong>FTC Act (Section 5):</strong> Unfair or deceptive practices in health data processing are prohibited. We comply with FTC guidance on health data and the Health Breach Notification Rule.</li>
<li><strong>Illinois BIPA:</strong> Biometric identifiers and information are collected only with informed written consent, stored for no longer than necessary, and destroyed on schedule.</li>
<li><strong>California CCPA / CPRA:</strong> California residents have rights to know, delete, correct, and opt out of sale/sharing. Health information constitutes Sensitive Personal Information subject to use limitation.</li>
<li><strong>Washington My Health My Data Act (MHMDA):</strong> Explicit consent is required to collect, share, or sell consumer health data. Washington residents may request a list of all third parties with whom their health data has been shared.</li>
<li><strong>Nevada SB 370:</strong> We do not sell consumer health data to data brokers or other entities without authorization.</li>
</ul>`,
      },
      {
        id: "chd-collection",
        title: "4. Consumer Health Data We Collect",
        summary: null,
        html: `<p>Healsend collects consumer health data in the following categories:</p>
<ul>
<li><strong>Patient-Provided Health Information:</strong> Symptoms, diagnoses, medical history, medications, allergies, surgical history, and other health data you enter during health intake or consultations.</li>
<li><strong>Provider-Generated Data:</strong> Clinical notes, treatment determinations, and prescription information created by Professional Entities and transmitted through the Platform.</li>
<li><strong>Technical Health Signals:</strong> Device data, IP address, and behavioral signals that may infer health-related interests (e.g., pages viewed related to specific treatments).</li>
<li><strong>Biometric Data (where collected):</strong> Face geometry used for identity verification during account creation (Illinois residents: subject to BIPA consent).</li>
<li><strong>Derived Health Inferences:</strong> Inferences drawn from the above categories to create profiles used to recommend treatments or personalize the Platform experience.</li>
</ul>
<p>We collect consumer health data only for the purposes described in this Policy. We obtain separate consent where required by law before using CHD for purposes beyond direct care delivery.</p>`,
      },
      {
        id: "chd-use",
        title: "5. How We Use Consumer Health Data",
        summary: null,
        html: `<h3>Primary Uses (no additional consent required)</h3>
<ul>
<li>Routing intake information to licensed Professional Entities for clinical review</li>
<li>Facilitating prescription transmission to pharmacies</li>
<li>Providing customer support related to your treatment</li>
<li>Detecting and investigating adverse events or safety concerns</li>
<li>Maintaining records as required by law</li>
<li>Defending legal claims and complying with court orders</li>
<li>Detecting security incidents and preventing fraud</li>
</ul>
<h3>Secondary Uses (require your explicit consent)</h3>
<ul>
<li>Using your health data for marketing purposes beyond your current treatment</li>
<li>Sharing de-identified data with research partners</li>
<li>Developing new products or services using your health profiles</li>
<li>Combining your health data with data from third-party data brokers</li>
</ul>
<p>We will never use your consumer health data for purposes incompatible with those listed without first obtaining your explicit written consent.</p>`,
      },
      {
        id: "chd-sharing",
        title: "6. When & Why We Share Your Data",
        summary: null,
        html: `<p>We share consumer health data only in the following circumstances:</p>
<ul>
<li><strong>Professional Entities:</strong> Licensed provider groups who review your case and provide clinical determinations. These entities are bound by HIPAA and our BAA.</li>
<li><strong>Pharmacies:</strong> Licensed compounding or retail pharmacies receive prescription data solely to fulfill authorized prescriptions.</li>
<li><strong>Technology Service Providers:</strong> Vendors providing EHR integrations, cloud hosting (U.S. data centers only), payment processing, and identity verification operate under DPAs limiting their use of your health data.</li>
<li><strong>Legal & Regulatory:</strong> We disclose data as required by law, court order, or regulatory authority.</li>
<li><strong>Business Transfers:</strong> In a merger or acquisition, health data is transferred subject to the same protections in this Policy and applicable law.</li>
</ul>
<p>We do not transfer your consumer health data outside the United States. All international service providers process data through U.S.-based systems under Standard Contractual Clauses or equivalent safeguards.</p>`,
      },
      {
        id: "chd-retention",
        title: "7. Retention & Deletion",
        summary: null,
        html: `<p>Consumer health data is retained according to the following schedule:</p>
<ul>
<li><strong>Active Account Data:</strong> Retained for the duration of your account plus 7 years after the last clinical activity, or as required by applicable state medical recordkeeping law.</li>
<li><strong>Prescription Records:</strong> Retained for 10 years or per state pharmacy board requirements.</li>
<li><strong>Biometric Data:</strong> Deleted within 3 years of collection or within 1 year of your last interaction, whichever is earlier (Illinois residents within 30 days of deletion request).</li>
<li><strong>Marketing Inferences:</strong> Deleted within 90 days of account closure or opt-out from marketing processing.</li>
<li><strong>Technical Logs:</strong> Anonymized or deleted within 24 months.</li>
</ul>
<p>To request deletion of your consumer health data, submit a request to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. We will verify your identity and respond within 45 days. Certain data may be retained to fulfill legal obligations, resolve disputes, or prevent fraud.</p>`,
      },
      {
        id: "chd-rights",
        title: "8. Your Privacy Rights",
        summary: null,
        html: `<p>You have the following rights with respect to your consumer health data:</p>
<ul>
<li><strong>Right to Access:</strong> Obtain a copy of the consumer health data we hold about you.</li>
<li><strong>Right to Correction:</strong> Request correction of inaccurate data.</li>
<li><strong>Right to Deletion:</strong> Request deletion of your consumer health data, subject to legal retention obligations.</li>
<li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
<li><strong>Right to Withdraw Consent:</strong> Withdraw consent to secondary uses of your health data at any time without affecting the lawfulness of prior processing.</li>
<li><strong>Right to Restrict Processing:</strong> Request that we restrict processing of your health data in certain circumstances.</li>
<li><strong>Right to List of Disclosures:</strong> (Washington residents) Request a list of all third parties with whom your consumer health data has been shared in the past 12 months.</li>
<li><strong>Right to Appeal:</strong> If we deny your request, you may appeal within 45 days.</li>
</ul>
<p>Submit rights requests to <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. We respond within 45 days (extendable by 45 days with written notice for complex requests).</p>`,
      },
      {
        id: "chd-state",
        title: "9. State-Specific Disclosures",
        summary: null,
        html: `<h3>California (CCPA / CPRA)</h3>
<p>Health information constitutes Sensitive Personal Information under the CPRA. We use and disclose your SPI only for the purposes described in Section 5. California residents may opt in to sharing for cross-context behavioral advertising (we do not currently engage in such sharing). Contact our Privacy Officer to exercise California rights.</p>
<h3>Washington (My Health My Data Act)</h3>
<p>We obtain your explicit consent before collecting consumer health data for any purpose beyond direct care delivery. Washington residents may request a complete list of third parties that have received their consumer health data. We do not sell Washington residents' consumer health data.</p>
<h3>Nevada (SB 370)</h3>
<p>We do not sell Nevada residents' consumer health data to third parties. We do not share Nevada residents' reproductive or sexual health information.</p>
<h3>Texas (HB 300)</h3>
<p>Texas residents' protected health information receives the same protections as HIPAA-covered data. We train all personnel who interact with Texas patients' health data and maintain training records for 6 years.</p>
<h3>Illinois (BIPA)</h3>
<p>We collect biometric identifiers only with written consent. We maintain a publicly available retention policy and destroy biometric data no later than 3 years after collection or within 30 days of a verified deletion request.</p>`,
      },
      {
        id: "chd-security",
        title: "10. Data Security & Incident Response",
        summary: null,
        html: `<h3>Security Controls</h3>
<p>We implement security controls aligned with NIST SP 800-53:</p>
<ul>
<li><strong>Technical Controls:</strong> TLS 1.3 for data in transit; AES-256 for data at rest; database encryption with customer-managed keys available for enterprise accounts; automated vulnerability scanning.</li>
<li><strong>Administrative Controls:</strong> Access control policy; privacy and security training for all personnel annually; vendor risk assessments; data classification policy.</li>
<li><strong>Physical Controls:</strong> Data hosted in SOC 2 Type II certified data centers in the United States; physical access controls at all facilities handling health data.</li>
</ul>
<h3>Incident Response</h3>
<p>In the event of a breach affecting your consumer health data:</p>
<ul>
<li>We will notify affected individuals within 30 days of discovery for state law purposes</li>
<li>We will notify HHS within 60 days for HIPAA breaches affecting 500+ individuals</li>
<li>We will notify the Washington Attorney General within 30 days for MHMDA breaches</li>
<li>Notification will include: description of data involved, timeline, steps taken to mitigate, and protective measures for affected individuals</li>
</ul>
<p>To report a suspected security incident, contact <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> immediately.</p>`,
      },
    ],
  },

  "refund-policy": {
    slug: "refund-policy",
    title: "Refund Policy",
    description:
      "Our commitment to fair refunds when medical treatments are unavailable or need to be changed.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "ref-overview",
        title: "1. Overview",
        summary: null,
        html: `<p><strong>Last Updated: January 1, 2025</strong></p>
<p>Healsend is committed to transparent and fair pricing. Because our services involve licensed medical professionals reviewing your case and issuing individualized clinical determinations, our refund policy reflects the unique nature of telehealth-based treatment plans.</p>
<p>Your treatment plan is subject to availability and clinical appropriateness. In some cases, a provider may determine that a requested treatment is not appropriate for you or is not available in your state. In these situations, our refund policy ensures you receive fair compensation.</p>`,
      },
      {
        id: "ref-unavailable",
        title: "2. Refunds for Unavailable Treatments",
        summary: null,
        html: `<p>If a provider determines that the requested treatment is medically inappropriate or unavailable for your specific case, you are entitled to a refund proportional to the unused portion of your subscription or payment:</p>
<ul>
<li><strong>Pre-Consultation:</strong> If no consultation has been conducted and no treatment has been issued, you are entitled to a full refund of any amounts paid for that treatment cycle.</li>
<li><strong>Post-Consultation, Pre-Shipment:</strong> If a consultation was completed but no medication has been dispensed or shipped, you are entitled to a partial refund equal to the medication cost minus any consultation fee.</li>
<li><strong>Partially Used Treatment:</strong> If medication has been partially dispensed or shipped, refunds will be prorated based on the unshipped or unused portion at the per-unit cost disclosed at checkout.</li>
</ul>
<p>We do not refund consultation or clinical review fees for completed consultations, as these represent the professional services of licensed clinicians.</p>`,
      },
      {
        id: "ref-switch",
        title: "3. Switching to an Alternative Treatment",
        summary: null,
        html: `<p>If your provider recommends switching to an alternative treatment within the same therapeutic category (for example, switching from one GLP-1 formulation to another), the cost difference, if any, will be:</p>
<ul>
<li><strong>No additional charge</strong> if the alternative treatment is at the same or lower price point.</li>
<li><strong>Prorated adjustment</strong> applying any prepaid balance toward the alternative for the remainder of your current subscription period.</li>
</ul>
<p>You are under no obligation to accept an alternative treatment. If you decline the alternative, you are entitled to a refund under the terms in Section 2.</p>`,
      },
      {
        id: "ref-processing",
        title: "4. Refund Processing",
        summary: null,
        html: `<p>Approved refunds are processed as follows:</p>
<ul>
<li><strong>Timeline:</strong> Refunds are initiated within 5 business days of approval and will appear on your original payment method within 5–30 days depending on your financial institution.</li>
<li><strong>Method:</strong> Refunds are returned to the original payment method used at checkout. We do not issue refunds as store credit or in an alternative form without your written consent.</li>
<li><strong>Currency:</strong> All refunds are issued in U.S. dollars.</li>
</ul>
<p>If you paid via a third-party financing provider, your refund will be applied to reduce your outstanding balance with that provider.</p>`,
      },
      {
        id: "ref-contact",
        title: "5. How to Request a Refund",
        summary: null,
        html: `<p>To request a refund, or if you have questions about a charge:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> with subject line "Refund Request"</li>
<li>Include your account email address, the date of purchase, and a brief description of your request</li>
</ul>
<p>Our support team will review your request and respond within 3 business days. Refund eligibility is determined in accordance with this Policy and the clinical facts of your case.</p>
<p>We are committed to resolving refund requests fairly and efficiently. If you believe a refund determination is incorrect, you may escalate to our Patient Advocate team at the same email address.</p>`,
      },
    ],
  },

  "safety-information": {
    slug: "safety-information",
    title: "Safety Information",
    description:
      "Important safety information for all medications and treatments available through Healsend.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "si-general",
        title: "1. General Safety Notices",
        summary: null,
        html: `<p><strong>Last Updated: January 1, 2025</strong></p>
<p><strong>EMERGENCY:</strong> If you are experiencing a medical emergency, call 911 immediately or go to the nearest emergency room. Do not use the Platform for emergency communications.</p>
<p><strong>Adverse Events:</strong> If you experience any unexpected or concerning symptoms after starting a treatment, contact your provider immediately through the Platform messaging system or call your local emergency services.</p>
<p><strong>Not Medical Advice:</strong> The information on this page is for general educational purposes and does not constitute individualized medical advice. All clinical decisions, including whether a medication is appropriate for you, are made by your licensed provider.</p>
<p><strong>Prescriptions Required:</strong> All medications available through Healsend require a valid prescription issued by a licensed provider following a clinical consultation. We do not dispense medications without a valid prescription.</p>
<p><strong>Healsend's Role:</strong> Healsend is a Management Services Organization (MSO) and technology platform, not a medical provider. All clinical care is provided by independent Professional Entities.</p>`,
      },
      {
        id: "si-advertisements",
        title: "2. Advertisements & Services",
        summary: null,
        html: `<p><strong>Paid Advertising:</strong> Healsend may run paid advertisements on third-party platforms. These advertisements are intended to inform potential patients about available telehealth services and do not constitute medical claims or guarantees of outcomes.</p>
<p><strong>Special Offers:</strong> Promotional pricing, free trial periods, or discounts may be available from time to time. These offers are subject to terms disclosed at the point of enrollment. Clinical determinations are not affected by promotional pricing.</p>
<p><strong>Trademarks:</strong> "Healsend" and all associated logos are trademarks of Healsend LLC. Third-party brand names appear for informational purposes only and do not imply endorsement.</p>`,
      },
      {
        id: "si-compounded",
        title: "3. About Compounded Medications",
        summary: null,
        html: `<p>Some medications available through Healsend are compounded by licensed 503A or 503B compounding pharmacies. Important information about compounded medications:</p>
<ul>
<li><strong>FDA Approval Status:</strong> Compounded medications are not evaluated, approved, or subject to the same pre-market review as commercially manufactured FDA-approved drugs. They are prepared for specific patients based on a prescription.</li>
<li><strong>Quality Standards:</strong> Our pharmacy partners operate under USP <797> and <800> standards for sterile and hazardous compounding. 503B outsourcing facilities comply with additional FDA oversight.</li>
<li><strong>Non-Interchangeability:</strong> Compounded medications are not generically equivalent to commercially available brand-name or generic products and should not be used interchangeably without consulting your provider.</li>
<li><strong>Personalized Formulations:</strong> Your provider may prescribe compounded medications in dosages or delivery forms (e.g., subcutaneous injection, nasal spray) not available commercially, tailored to your specific clinical needs.</li>
</ul>`,
      },
      {
        id: "si-semaglutide",
        title: "4. Compounded GLP-1 (Semaglutide)",
        summary: null,
        html: `<p><strong>WARNING:</strong> Semaglutide is indicated for chronic weight management in adults with obesity (BMI ≥30) or overweight (BMI ≥27) with at least one weight-related condition, or for glycemic control in type 2 diabetes. It is not indicated for type 1 diabetes or as a first-line therapy for all patients.</p>
<h3>BLACK BOX WARNING — Thyroid C-Cell Tumors</h3>
<p>GLP-1 receptor agonists, including semaglutide, cause thyroid C-cell tumors in rodents at clinically relevant exposures. It is unknown whether semaglutide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans. This medication is contraindicated in patients with a personal or family history of MTC or in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).</p>
<h3>Common Side Effects</h3>
<ul>
<li>Nausea, vomiting, diarrhea, constipation</li>
<li>Abdominal pain or discomfort</li>
<li>Decreased appetite</li>
<li>Headache, fatigue</li>
<li>Injection site reactions (redness, irritation)</li>
</ul>
<h3>Serious Side Effects — Seek Immediate Medical Attention</h3>
<ul>
<li>Pancreatitis: severe persistent abdominal pain</li>
<li>Gallbladder problems: abdominal pain, jaundice, fever</li>
<li>Hypoglycemia (especially if combined with other diabetic medications)</li>
<li>Acute kidney injury from dehydration due to severe GI side effects</li>
<li>Allergic reactions: rash, itching, rapid heartbeat, difficulty breathing</li>
</ul>
<h3>Drug Interactions</h3>
<ul>
<li>Slows gastric emptying — may affect absorption of oral medications taken concurrently</li>
<li>Insulin and insulin secretagogues: increased hypoglycemia risk</li>
<li>Warfarin: monitor INR closely when starting or changing semaglutide dose</li>
</ul>`,
      },
      {
        id: "si-tirzepatide",
        title: "5. Compounded GLP-1+GIP (Tirzepatide)",
        summary: null,
        html: `<p><strong>WARNING:</strong> Tirzepatide is a dual GIP and GLP-1 receptor agonist. Like semaglutide, it carries a BLACK BOX WARNING for thyroid C-cell tumors in rodents. Contraindicated in patients with personal or family history of MTC or MEN 2.</p>
<h3>Serious Side Effects — Seek Immediate Medical Attention</h3>
<ul>
<li>Pancreatitis: persistent severe abdominal pain radiating to the back</li>
<li>Severe hypoglycemia when used with insulin or sulfonylurea</li>
<li>Acute kidney injury</li>
<li>Severe gastrointestinal events requiring hospitalization</li>
<li>Diabetic retinopathy complications (in patients with pre-existing diabetic retinopathy)</li>
</ul>
<h3>Common Side Effects</h3>
<ul>
<li>Nausea (most common, typically transient)</li>
<li>Diarrhea, vomiting, constipation</li>
<li>Abdominal pain, dyspepsia</li>
<li>Decreased appetite</li>
<li>Injection site reactions</li>
<li>Fatigue, dizziness</li>
</ul>
<h3>Drug Interactions</h3>
<ul>
<li>Oral contraceptives: administer at least 4 weeks before initiating tirzepatide; after reaching maintenance dose, administer at the same time each day or switch to non-oral contraceptive option</li>
<li>Insulin: dose reduction may be required; close glucose monitoring recommended</li>
<li>Medications with narrow therapeutic windows: monitor more frequently as absorption may be affected</li>
</ul>`,
      },
      {
        id: "si-nad",
        title: "6. NAD+ (Nicotinamide Adenine Dinucleotide)",
        summary: null,
        html: `<h3>Available Forms</h3>
<p>NAD+ is available as subcutaneous injection and intranasal spray. Formulations and dosages are individualized by your provider.</p>
<h3>Common Side Effects</h3>
<ul>
<li><strong>Injection:</strong> Flushing, warmth, tingling or itching at injection site, nausea, fatigue, headache</li>
<li><strong>Nasal Spray:</strong> Nasal irritation or dryness, headache, mild flushing</li>
</ul>
<h3>Warnings</h3>
<ul>
<li>Do not use if you have known hypersensitivity to NAD+ or any component of the formulation</li>
<li>Limited long-term human safety data exists; discuss duration of therapy with your provider</li>
<li>Not FDA-approved for any specific indication; evidence base is primarily in vitro and animal studies with limited clinical trial data</li>
</ul>
<h3>Contraindications</h3>
<ul>
<li>Known allergy to NAD+ formulation components</li>
<li>Active cancer (relative contraindication — discuss with oncologist)</li>
<li>Pregnancy or breastfeeding (insufficient data)</li>
</ul>
<h3>Drug Interactions</h3>
<p>No well-established drug interactions identified. May theoretically interact with PARP inhibitors used in oncology. Inform your provider of all medications.</p>
<h3>Storage</h3>
<p>Store per pharmacy label instructions, typically refrigerated at 2–8°C. Protect from light. Do not use if discolored or particulate matter is visible.</p>`,
      },
      {
        id: "si-sermorelin",
        title: "7. Sermorelin",
        summary: null,
        html: `<p>Sermorelin is a growth hormone-releasing hormone (GHRH) analogue that stimulates the pituitary gland to produce and release growth hormone.</p>
<h3>Common Side Effects</h3>
<ul>
<li>Injection site reactions (redness, pain, swelling)</li>
<li>Flushing</li>
<li>Headache</li>
<li>Dizziness</li>
<li>Nausea</li>
</ul>
<h3>Less Common Side Effects</h3>
<ul>
<li>Changes in taste</li>
<li>Hyperactivity or restlessness</li>
<li>Somnolence</li>
<li>Difficulty swallowing (rare)</li>
</ul>
<h3>Warnings</h3>
<ul>
<li>May increase IGF-1 levels; routine monitoring recommended during therapy</li>
<li>Patients with active malignancy should not use sermorelin without oncologist guidance</li>
<li>Hypothyroidism may reduce response; treat underlying thyroid conditions before or during therapy</li>
</ul>
<h3>Contraindications</h3>
<ul>
<li>Known hypersensitivity to sermorelin or any formulation component</li>
<li>Active malignancy</li>
<li>Pregnancy (Category C; insufficient human data)</li>
</ul>
<h3>Drug Interactions</h3>
<ul>
<li>Glucocorticoids may blunt sermorelin's effect on growth hormone release</li>
<li>Insulin and anti-diabetic agents: growth hormone elevation may alter glucose metabolism; monitor closely</li>
</ul>
<h3>Storage</h3>
<p>Refrigerate at 2–8°C. Reconstituted solutions should be used within the timeframe specified by the compounding pharmacy, typically within 30 days.</p>`,
      },
      {
        id: "si-pt141",
        title: "8. Compounded PT-141 (Bremelanotide) Nasal Spray",
        summary: null,
        html: `<p>PT-141 (bremelanotide) is a melanocortin receptor agonist used for hypoactive sexual desire disorder (HSDD). The FDA-approved version is an autoinjector (Vyleesi®); compounded nasal spray is not FDA-approved.</p>
<p><strong>WARNING:</strong> PT-141 can cause transient increases in blood pressure. It is contraindicated in patients with cardiovascular disease or uncontrolled hypertension.</p>
<h3>Drug Interactions</h3>
<ul>
<li><strong>Naltrexone:</strong> Reduces PT-141 effectiveness; avoid co-administration</li>
<li><strong>Antihypertensives:</strong> Blood pressure effects may interact; monitor blood pressure</li>
<li>Do not use with other melanocortin agonists</li>
</ul>
<h3>Contraindications</h3>
<ul>
<li>Cardiovascular disease or uncontrolled hypertension</li>
<li>Pregnancy or breastfeeding</li>
<li>Hypersensitivity to bremelanotide or formulation components</li>
</ul>
<h3>Common Side Effects</h3>
<ul>
<li>Flushing (most common)</li>
<li>Nausea</li>
<li>Headache</li>
<li>Nasal congestion or irritation (nasal spray form)</li>
<li>Transient blood pressure increase</li>
<li>Hyperpigmentation with frequent use (fades after discontinuation)</li>
</ul>
<h3>Storage</h3>
<p>Store at room temperature (15–30°C), away from heat and light. Do not freeze. Discard per compounding pharmacy guidelines.</p>`,
      },
    ],
  },

  "terms-of-service-2": {
    slug: "terms-of-service-2",
    title: "Terms of Service",
    description:
      "The binding agreement governing your use of the Healsend platform and telehealth services.",
    nativeTemplate: "legalDocument",
    hasRenderableBody: false,
    introHtml: null,
    faqItems: [],
    sectionBlocks: [
      {
        id: "tos-overview",
        title: "1. Overview & Acceptance",
        summary: null,
        html: `<p><strong>Last Updated: January 1, 2025 | Effective Date: January 1, 2025</strong></p>
<p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "Patient," "you") and Healsend LLC ("Healsend," "we," "us," "our"). By accessing or using the Healsend platform, website, or any associated services (collectively, the "Platform"), you agree to be bound by these Terms.</p>
<p><strong>If you do not agree to these Terms, do not use the Platform.</strong></p>
<p>These Terms incorporate by reference our <a href="/privacy-policy">Privacy Policy</a>, <a href="/consent-to-telehealth-2">Telehealth Consent</a>, <a href="/refund-policy">Refund Policy</a>, and <a href="/safety-information">Safety Information</a>. In the event of a conflict between these Terms and any incorporated document, these Terms control.</p>
<p>We reserve the right to modify these Terms at any time. Material changes will be communicated via email or a prominent notice on the Platform. Continued use after the effective date of any modification constitutes acceptance of the revised Terms.</p>`,
      },
      {
        id: "tos-about",
        title: "2. About Healsend",
        summary: null,
        html: `<p>Healsend is a Management Services Organization (MSO) and technology company. We provide an administrative and technology platform through which licensed healthcare professionals and Independent Professional Entities deliver telehealth services to patients.</p>
<h3>Healsend is NOT:</h3>
<ul>
<li>A medical provider, hospital, or healthcare system</li>
<li>A licensed physician group</li>
<li>An employer of licensed clinicians in their clinical capacity</li>
<li>A pharmacy or drug manufacturer</li>
</ul>
<h3>Healsend IS:</h3>
<ul>
<li>A technology platform connecting patients with independent licensed providers</li>
<li>An administrative services provider to Professional Entities</li>
<li>A business associate of HIPAA-covered Professional Entities</li>
</ul>
<p>All clinical decisions, diagnoses, prescriptions, and treatment determinations are made exclusively by the independent licensed professionals affiliated with the Platform's Professional Entities. These professionals exercise independent clinical judgment and are not directed by Healsend in their clinical practice.</p>`,
      },
      {
        id: "tos-eligibility",
        title: "3. Eligibility & User Responsibilities",
        summary: null,
        html: `<h3>Eligibility Requirements</h3>
<p>To use the Platform, you must:</p>
<ul>
<li>Be at least 18 years of age</li>
<li>Be a resident of a U.S. state where Healsend services are available</li>
<li>Have legal authority to enter into binding contracts under applicable law</li>
<li>Provide accurate, current, and complete information about yourself</li>
</ul>
<h3>Account Security</h3>
<p>You are responsible for:</p>
<ul>
<li>Maintaining the confidentiality of your account credentials</li>
<li>All activities that occur under your account</li>
<li>Notifying us immediately at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> of any unauthorized access</li>
</ul>
<h3>Prohibited Conduct</h3>
<p>You may not:</p>
<ul>
<li>Provide false or misleading health information</li>
<li>Use the Platform for any unlawful purpose</li>
<li>Attempt to access another user's account</li>
<li>Use automated tools to scrape or extract data from the Platform</li>
<li>Circumvent access controls or security measures</li>
<li>Resell or transfer access to your account</li>
</ul>`,
      },
      {
        id: "tos-services",
        title: "4. Description of Services",
        summary: null,
        html: `<p>Through the Platform, you may access:</p>
<ul>
<li><strong>Health Intake & Consultation:</strong> Complete questionnaires reviewed by licensed providers who issue clinical determinations.</li>
<li><strong>Prescription Management:</strong> Where clinically appropriate, receive prescriptions transmitted to licensed pharmacies on your behalf.</li>
<li><strong>Treatment Plans:</strong> Ongoing access to personalized treatment protocols developed by your assigned provider.</li>
<li><strong>Secure Messaging:</strong> Communicate with your care team within the Platform.</li>
<li><strong>Progress Tracking:</strong> Log health metrics and receive automated insights.</li>
</ul>
<h3>Service Limitations</h3>
<ul>
<li>Services are not available in all U.S. states</li>
<li>Not all treatments are available in all states due to state-specific regulations</li>
<li>We do not provide emergency services, in-person care, or urgent care</li>
<li>Availability is subject to provider capacity and clinical appropriateness</li>
</ul>`,
      },
      {
        id: "tos-payment",
        title: "5. Payment, Billing & Refunds",
        summary: null,
        html: `<h3>Payment Authorization</h3>
<p>By providing payment information, you authorize Healsend to charge the stated fees for services and, for subscriptions, to automatically charge your payment method on each billing cycle date until you cancel.</p>
<h3>Subscriptions</h3>
<ul>
<li>Subscriptions auto-renew until cancelled</li>
<li>Cancel at any time through account settings or by contacting support; cancellation takes effect at the end of the current billing period</li>
<li>We do not pro-rate partial subscription periods for voluntary cancellations</li>
</ul>
<h3>Refunds</h3>
<p>Refunds are governed by our <a href="/refund-policy">Refund Policy</a>. In summary: refunds are available when treatments are clinically unavailable for you. Consultation fees are non-refundable after clinical review is complete.</p>
<h3>Insurance & FSA/HSA</h3>
<p>We do not bill insurance. All fees are self-pay. Telehealth consultation fees may be eligible for reimbursement from FSA or HSA accounts; consult your plan administrator. We can provide an itemized receipt upon request.</p>
<h3>Chargebacks</h3>
<p>Before initiating a chargeback with your financial institution, please contact us at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a>. Fraudulent chargebacks may result in account suspension and collection action.</p>`,
      },
      {
        id: "tos-privacy",
        title: "6. Privacy & Data Handling",
        summary: null,
        html: `<p>Your use of the Platform is subject to our <a href="/privacy-policy">Privacy Policy</a> and, where applicable, our <a href="/consumer-health-data">Consumer Health Data Policy</a>. These policies describe how we collect, use, share, and protect your personal and health information.</p>
<p>By using the Platform, you consent to the data practices described in those policies, including:</p>
<ul>
<li>Sharing health intake information with your assigned Professional Entity</li>
<li>Transmitting prescriptions to licensed pharmacies</li>
<li>Using analytics to improve the Platform</li>
<li>Sending transactional and, with your consent, marketing communications</li>
</ul>
<p>Where Healsend acts as a business associate of a HIPAA-covered Professional Entity, your Protected Health Information is governed by a Business Associate Agreement and the Professional Entity's Notice of Privacy Practices.</p>`,
      },
      {
        id: "tos-disclaimers",
        title: "7. Disclaimers & Limitation of Liability",
        summary: null,
        html: `<h3>No Medical Warranty</h3>
<p>THE PLATFORM IS PROVIDED "AS IS." HEALSEND DOES NOT WARRANT THAT THE PLATFORM WILL BE ERROR-FREE, UNINTERRUPTED, OR SECURE. HEALSEND DOES NOT MAKE ANY REPRESENTATION REGARDING THE QUALITY, ACCURACY, OR APPROPRIATENESS OF ANY CLINICAL DETERMINATION MADE BY AN INDEPENDENT PROVIDER.</p>
<h3>Limitation of Liability</h3>
<p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HEALSEND'S TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE TOTAL FEES YOU PAID TO HEALSEND IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
<p>IN NO EVENT SHALL HEALSEND BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
<h3>Indemnification</h3>
<p>You agree to indemnify and hold harmless Healsend, its officers, directors, and employees from any claims arising from your violation of these Terms, your use of the Platform, or your provision of false or misleading health information.</p>`,
      },
      {
        id: "tos-disputes",
        title: "8. Dispute Resolution & Arbitration",
        summary: null,
        html: `<h3>Good Faith Resolution</h3>
<p>Before initiating formal proceedings, you agree to contact Healsend at <a href="mailto:yourhealth@healsend.com">yourhealth@healsend.com</a> and attempt to resolve the dispute informally for a period of 30 days.</p>
<h3>Binding Arbitration</h3>
<p>If informal resolution fails, all disputes will be resolved by final and binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. Arbitration will take place in Sheridan, Wyoming, or remotely at the parties' election. The Federal Arbitration Act governs the interpretation and enforcement of this clause.</p>
<h3>Class Action Waiver</h3>
<p><strong>YOU AND HEALSEND EXPRESSLY WAIVE ANY RIGHT TO BRING OR PARTICIPATE IN A CLASS ACTION, CONSOLIDATED ACTION, OR REPRESENTATIVE ACTION.</strong> All claims must be brought in your individual capacity.</p>
<h3>Exceptions</h3>
<p>Either party may seek emergency injunctive relief in any court of competent jurisdiction. Small claims court actions may be brought without arbitration if claims qualify within that court's jurisdiction.</p>
<h3>Governing Law</h3>
<p>These Terms are governed by the laws of the State of Wyoming, without regard to conflict of law principles.</p>`,
      },
      {
        id: "tos-hipaa",
        title: "9. HIPAA & Vendor Management",
        summary: null,
        html: `<h3>Business Associate Role</h3>
<p>Where Healsend handles Protected Health Information on behalf of a HIPAA-covered Professional Entity, Healsend acts as a Business Associate subject to a signed Business Associate Agreement (BAA). Healsend complies with HIPAA Privacy and Security Rules in its BA capacity.</p>
<h3>Subprocessors & Chain of Trust</h3>
<p>Healsend maintains a chain of trust by requiring all subprocessors who handle PHI to execute BAAs. Our vendor management program includes:</p>
<ul>
<li>Annual security questionnaires for all vendors handling health data</li>
<li>Written agreements containing HIPAA-required provisions</li>
<li>Prompt notification obligations if a subprocessor discovers a breach</li>
<li>Right to audit vendor security practices upon reasonable notice</li>
</ul>
<h3>Prescription Fulfillment</h3>
<p>Prescriptions generated through the Platform are issued by licensed providers and transmitted electronically to licensed compounding or retail pharmacies. Healsend does not hold pharmaceutical licenses and does not dispense medications. The pharmacies are independent licensed entities subject to applicable state and federal pharmacy laws.</p>`,
      },
      {
        id: "tos-state-addenda",
        title: "10. State-Specific Addenda",
        summary: null,
        html: `<h3>California</h3>
<p>California consumers have rights under the CCPA/CPRA as described in our <a href="/privacy-policy">Privacy Policy</a>. California law requires that certain disclosures be made regarding arbitration; the AAA Consumer Arbitration Rules govern this agreement. California Business & Professions Code § 17200 claims are subject to arbitration under these Terms.</p>
<h3>Washington</h3>
<p>Washington residents have consumer health data rights under the My Health My Data Act as described in our <a href="/consumer-health-data">Consumer Health Data Policy</a>. Washington residents may bring claims under WA CPA in small claims court notwithstanding the arbitration clause.</p>
<h3>Texas</h3>
<p>Texas residents' health information is protected under Texas Health & Safety Code § 181 (Texas Medical Records Privacy Act). We maintain BAAs with all entities that handle Texas residents' health information and maintain training records for 6 years.</p>
<h3>Florida & New York</h3>
<p>Residents of these states have additional rights under state telehealth laws. State-specific service limitations may apply based on scope-of-practice or telehealth prescribing regulations in your state.</p>
<h3>Colorado & Virginia</h3>
<p>Residents of these states have data rights under their respective Consumer Data Protection Acts. These do not override the arbitration clause but supplement your privacy rights as described in our policies.</p>`,
      },
    ],
  },
};
