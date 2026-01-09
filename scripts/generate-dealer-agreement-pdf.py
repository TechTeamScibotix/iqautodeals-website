#!/usr/bin/env python3
"""
Generate IQ Auto Deals Dealer Services Agreement PDF
"""

from fpdf import FPDF
from datetime import datetime

class DealerAgreementPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=25)

    def header(self):
        if self.page_no() > 1:
            self.set_font('Helvetica', 'I', 9)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, 'IQ Auto Deals - Dealer Services Agreement', align='C')
            self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(0, 0, 0)
        self.ln(8)
        self.multi_cell(0, 7, title)
        self.ln(2)

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(0, 0, 0)
        self.ln(5)
        self.multi_cell(0, 6, title)
        self.ln(1)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 5, text)
        self.ln(2)

    def bullet_point(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(0, 0, 0)
        self.set_x(20)
        self.multi_cell(0, 5, f"  * {text}")

    def highlighted_box(self, title, content, bullets=None):
        self.ln(3)
        self.set_fill_color(240, 248, 255)
        self.set_draw_color(200, 200, 200)

        # Calculate height needed
        self.set_font('Helvetica', 'B', 10)
        start_y = self.get_y()

        # Draw box background
        self.rect(15, start_y, 180, 8 + len(content)//80 * 5 + (len(bullets) * 6 if bullets else 0), 'F')

        self.set_xy(18, start_y + 3)
        self.cell(0, 5, title)
        self.ln(6)

        self.set_font('Helvetica', '', 10)
        self.set_x(18)
        self.multi_cell(170, 5, content)

        if bullets:
            for bullet in bullets:
                self.set_x(22)
                self.multi_cell(166, 5, f"* {bullet}")

        self.ln(5)

    def signature_line(self, label, include_date=True):
        self.ln(8)
        self.set_font('Helvetica', '', 10)

        # Signature line
        self.cell(90, 5, '_' * 45)
        if include_date:
            self.cell(10, 5, '')
            self.cell(60, 5, '_' * 30)
        self.ln(5)

        self.set_font('Helvetica', '', 9)
        self.cell(90, 5, label)
        if include_date:
            self.cell(10, 5, '')
            self.cell(60, 5, 'Date')
        self.ln(10)


def generate_dealer_agreement():
    pdf = DealerAgreementPDF()
    pdf.alias_nb_pages()
    pdf.add_page()

    # Title
    pdf.set_font('Helvetica', 'B', 20)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 15, 'IQ AUTO DEALS', align='C')
    pdf.ln(12)

    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, 'Dealer Services Agreement', align='C')
    pdf.ln(15)

    # Effective date
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 5, f'Effective Date: ____________________', align='C')
    pdf.ln(15)

    # Introduction
    pdf.body_text(
        'This Dealer Services Agreement ("Agreement") is entered into between IQ Auto Deals, '
        'a service of Scibotix Solutions LLC ("Company," "we," "us," or "our"), and the '
        'automotive dealership ("Dealer," "you," or "your") identified below.'
    )

    # Section 1
    pdf.chapter_title('1. SERVICE OVERVIEW')
    pdf.body_text(
        'IQ Auto Deals provides an online automotive marketplace platform that connects licensed '
        'automotive dealers with consumers seeking to purchase vehicles. Our platform enables '
        'dealers to list their inventory, receive purchase inquiries, and connect with qualified buyers.'
    )

    # Section 2
    pdf.chapter_title('2. SUBSCRIPTION TERMS')

    pdf.section_title('2.1 Month-to-Month Agreement')
    pdf.body_text(
        'This Agreement operates on a MONTH-TO-MONTH BASIS. There is no long-term commitment '
        'required. Your subscription automatically renews each month until cancelled by either party.'
    )

    pdf.section_title('2.2 Billing Cycle')
    pdf.body_text(
        'Subscription fees are billed monthly in advance on the same date each month as your initial '
        'subscription date. All fees are non-refundable except as expressly provided in this Agreement.'
    )

    pdf.section_title('2.3 Cancellation')
    pdf.body_text(
        'Either party may cancel this Agreement at any time with WRITTEN NOTICE. Cancellation will '
        'be effective at the end of the current billing cycle. To cancel, contact us at '
        'dealers@iqautodeals.com or through your dealer dashboard.'
    )

    pdf.section_title('2.4 Free Trial')
    pdf.body_text(
        'New dealers may be eligible for a complimentary trial period. During the trial, you will have '
        'full access to platform features. At the end of the trial period, your subscription will '
        'automatically convert to a paid subscription unless cancelled.'
    )

    # Section 3
    pdf.chapter_title('3. INVENTORY INTEGRATION OPTIONS')
    pdf.body_text(
        'We offer multiple methods to import and manage your vehicle inventory on our platform:'
    )

    pdf.section_title('3.1 Website Import (Automated Sync)')
    pdf.body_text('QUICK INVENTORY EXPOSURE: We can automatically import your inventory directly from your existing dealership website. This option provides:')
    pdf.bullet_point('Automated daily synchronization of your inventory')
    pdf.bullet_point('No manual data entry required')
    pdf.bullet_point('Vehicle details, photos, and pricing pulled directly from your site')
    pdf.bullet_point('Immediate exposure to our buyer network')
    pdf.bullet_point('Automatic removal of sold vehicles')
    pdf.ln(3)
    pdf.body_text(
        'Supported platforms include DealerOn, Dealer.com, DealerInspire, and most major dealership '
        'website providers. Contact us to verify compatibility with your website platform.'
    )

    pdf.section_title('3.2 DMS/IMS Direct Integration')
    pdf.body_text('ENTERPRISE INTEGRATION: For dealerships seeking deeper integration, we offer direct connectivity with your Dealer Management System (DMS) or Inventory Management System (IMS):')
    pdf.bullet_point('Real-time inventory synchronization')
    pdf.bullet_point('Direct API integration with major DMS providers')
    pdf.bullet_point('Supported systems: DealerTrack, CDK Global, Reynolds & Reynolds, vAuto, HomeNet, DealerSocket')
    pdf.bullet_point('Custom integration available upon request')
    pdf.bullet_point('Automatic price and status updates')
    pdf.bullet_point('Enhanced vehicle data including history reports and certifications')

    pdf.section_title('3.3 Manual Entry')
    pdf.body_text(
        'Dealers may also manually add, edit, and manage individual vehicle listings through the dealer '
        'dashboard. VIN decoding is provided to streamline the listing process.'
    )

    # Section 4
    pdf.chapter_title('4. DEALER OBLIGATIONS')

    pdf.section_title('4.1 Licensing Requirements')
    pdf.body_text(
        'Dealer represents and warrants that it is a licensed automotive dealer in good standing in all '
        'jurisdictions where it conducts business. Dealer agrees to maintain all required licenses '
        'throughout the term of this Agreement.'
    )

    pdf.section_title('4.2 Inventory Accuracy')
    pdf.body_text('Dealer is responsible for ensuring that all vehicle listings are accurate, current, and comply with all applicable laws and regulations. This includes:')
    pdf.bullet_point('Accurate vehicle descriptions, specifications, and conditions')
    pdf.bullet_point('Current and truthful pricing information')
    pdf.bullet_point('Timely removal or update of sold or unavailable vehicles')
    pdf.bullet_point('Authentic photographs of actual vehicles')
    pdf.bullet_point('Disclosure of any material defects, accidents, or title issues')

    pdf.section_title('4.3 Customer Interactions')
    pdf.body_text(
        'Dealer agrees to respond to customer inquiries in a timely and professional manner. Dealer '
        'shall honor all pricing and offers submitted through the platform, subject to vehicle availability.'
    )

    pdf.section_title('4.4 Compliance')
    pdf.body_text(
        'Dealer agrees to comply with all applicable federal, state, and local laws and regulations, '
        'including but not limited to FTC regulations, state consumer protection laws, and advertising guidelines.'
    )

    # Section 5
    pdf.chapter_title('5. PLATFORM FEATURES')
    pdf.body_text('Subject to the terms of this Agreement and payment of applicable fees, Dealer shall have access to:')
    pdf.bullet_point('Vehicle listing and inventory management tools')
    pdf.bullet_point('Customer lead management dashboard')
    pdf.bullet_point('Deal request and negotiation system')
    pdf.bullet_point('Analytics and performance reporting')
    pdf.bullet_point('Customer communication tools')
    pdf.bullet_point('Integration with Scibotix Dealer Portal (Vynalytics, ShowRoom AI, etc.)')

    # Section 6
    pdf.chapter_title('6. FEES AND PAYMENT')

    pdf.section_title('6.1 Subscription Fees')
    pdf.body_text(
        'Dealer agrees to pay the monthly subscription fee according to the selected plan. Current '
        'pricing is available at iqautodeals.com/pricing or upon request.'
    )

    pdf.section_title('6.2 Payment Method')
    pdf.body_text(
        'Dealer shall provide a valid credit card or bank account for automatic monthly payments. '
        'Dealer authorizes Company to charge the provided payment method for all applicable fees.'
    )

    pdf.section_title('6.3 Late Payment')
    pdf.body_text(
        'If payment is not received within ten (10) days of the due date, Company reserves the right '
        'to suspend Dealer\'s account until payment is received. Continued non-payment may result '
        'in termination of this Agreement.'
    )

    # Section 7
    pdf.chapter_title('7. INTELLECTUAL PROPERTY')
    pdf.body_text(
        'Dealer grants Company a non-exclusive, royalty-free license to use, display, and distribute '
        'Dealer\'s vehicle listings, photographs, and related content on the platform and in marketing '
        'materials. Dealer represents that it has the right to grant such license.'
    )

    # Section 8
    pdf.chapter_title('8. LIMITATION OF LIABILITY')
    pdf.body_text(
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT, '
        'INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO '
        'LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO THIS '
        'AGREEMENT OR THE USE OF THE PLATFORM.'
    )
    pdf.body_text(
        'Company\'s total liability under this Agreement shall not exceed the amount of fees paid by '
        'Dealer in the twelve (12) months preceding the claim.'
    )

    # Section 9
    pdf.chapter_title('9. INDEMNIFICATION')
    pdf.body_text('Dealer agrees to indemnify, defend, and hold harmless Company and its officers, directors, employees, and agents from and against any claims, damages, losses, or expenses arising out of or related to:')
    pdf.bullet_point('Dealer\'s breach of this Agreement')
    pdf.bullet_point('Dealer\'s violation of any applicable law or regulation')
    pdf.bullet_point('Any claims related to vehicles sold through the platform')
    pdf.bullet_point('Any disputes with customers or other dealers')

    # Section 10
    pdf.chapter_title('10. TERMINATION')

    pdf.section_title('10.1 Termination for Convenience')
    pdf.body_text(
        'Either party may terminate this Agreement for any reason with thirty (30) days written notice. '
        'Termination will be effective at the end of the current billing cycle.'
    )

    pdf.section_title('10.2 Termination for Cause')
    pdf.body_text('Company may terminate this Agreement immediately if Dealer:')
    pdf.bullet_point('Violates any material term of this Agreement')
    pdf.bullet_point('Engages in fraudulent or illegal activity')
    pdf.bullet_point('Fails to maintain required dealer licenses')
    pdf.bullet_point('Receives excessive customer complaints')
    pdf.bullet_point('Fails to pay fees when due')

    pdf.section_title('10.3 Effect of Termination')
    pdf.body_text(
        'Upon termination, Dealer\'s access to the platform will be disabled, and all vehicle listings '
        'will be removed. Dealer remains responsible for any fees incurred prior to termination.'
    )

    # Section 11
    pdf.chapter_title('11. DATA AND PRIVACY')
    pdf.body_text(
        'Company will handle Dealer\'s data and customer information in accordance with our Privacy '
        'Policy. Dealer agrees to comply with all applicable data protection laws in its use of '
        'customer information obtained through the platform.'
    )

    # Section 12
    pdf.chapter_title('12. CONFIDENTIALITY')
    pdf.body_text(
        'Both parties agree to keep confidential any proprietary or sensitive business information '
        'disclosed during the course of this Agreement. This obligation survives termination of the Agreement.'
    )

    # Section 13
    pdf.chapter_title('13. MODIFICATIONS')
    pdf.body_text(
        'Company reserves the right to modify this Agreement at any time. Dealer will be notified of '
        'material changes at least thirty (30) days in advance. Continued use of the platform after '
        'such notice constitutes acceptance of the modified terms.'
    )

    # Section 14
    pdf.chapter_title('14. GOVERNING LAW')
    pdf.body_text(
        'This Agreement shall be governed by and construed in accordance with the laws of the State '
        'of Georgia, without regard to its conflict of law provisions. Any disputes arising under this '
        'Agreement shall be resolved in the state or federal courts located in Fulton County, Georgia.'
    )

    # Section 15
    pdf.chapter_title('15. ENTIRE AGREEMENT')
    pdf.body_text(
        'This Agreement, together with any applicable order forms or addenda, constitutes the entire '
        'agreement between the parties with respect to the subject matter hereof and supersedes all '
        'prior or contemporaneous agreements, representations, or understandings.'
    )

    # Signature Page
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 10, 'SIGNATURE PAGE', align='C')
    pdf.ln(15)

    pdf.body_text(
        'By signing below, the parties acknowledge that they have read, understood, and agree to be '
        'bound by all terms and conditions of this Dealer Services Agreement.'
    )
    pdf.ln(10)

    # Company signature
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, 'IQ AUTO DEALS (Scibotix Solutions LLC)')
    pdf.ln(10)
    pdf.signature_line('Authorized Representative Signature')

    pdf.set_font('Helvetica', '', 10)
    pdf.cell(90, 5, 'Print Name: _________________________________')
    pdf.ln(8)
    pdf.cell(90, 5, 'Title: _________________________________')
    pdf.ln(20)

    # Dealer signature
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, 'DEALER')
    pdf.ln(10)

    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 5, 'Dealership Name: _______________________________________________')
    pdf.ln(8)
    pdf.cell(0, 5, 'Dealer License Number: _______________________________________________')
    pdf.ln(8)
    pdf.cell(0, 5, 'Business Address: _______________________________________________')
    pdf.ln(8)
    pdf.cell(0, 5, '                   _______________________________________________')
    pdf.ln(8)
    pdf.cell(0, 5, 'Phone: ________________________  Email: ________________________')
    pdf.ln(8)
    pdf.cell(0, 5, 'Website URL: _______________________________________________')
    pdf.ln(15)

    pdf.signature_line('Authorized Representative Signature')

    pdf.set_font('Helvetica', '', 10)
    pdf.cell(90, 5, 'Print Name: _________________________________')
    pdf.ln(8)
    pdf.cell(90, 5, 'Title: _________________________________')
    pdf.ln(20)

    # Selected Plan
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, 'SELECTED SUBSCRIPTION PLAN')
    pdf.ln(8)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 6, '[ ] Silver Plan    [ ] Gold Plan    [ ] Platinum Plan    [ ] Custom')
    pdf.ln(8)
    pdf.cell(0, 6, 'Monthly Fee: $______________')
    pdf.ln(8)
    pdf.cell(0, 6, 'Integration Method:  [ ] Website Import    [ ] DMS/IMS Integration    [ ] Manual Entry')
    pdf.ln(15)

    # Contact info
    pdf.set_draw_color(200, 200, 200)
    pdf.set_fill_color(248, 248, 248)
    pdf.rect(15, pdf.get_y(), 180, 35, 'FD')
    pdf.set_xy(20, pdf.get_y() + 5)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(0, 5, 'IQ Auto Deals - Dealer Support')
    pdf.ln(6)
    pdf.set_x(20)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 5, 'A service of Scibotix Solutions LLC')
    pdf.ln(6)
    pdf.set_x(20)
    pdf.cell(0, 5, 'Email: dealers@iqautodeals.com')
    pdf.ln(6)
    pdf.set_x(20)
    pdf.cell(0, 5, 'Website: https://iqautodeals.com')

    # Save PDF
    output_path = '/Users/joeduran/priceyourauto/IQ_Auto_Deals_Dealer_Agreement.pdf'
    pdf.output(output_path)
    print(f'PDF generated: {output_path}')
    return output_path

if __name__ == '__main__':
    generate_dealer_agreement()
