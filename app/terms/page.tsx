import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  const lastUpdated = "May 19, 2025"

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground max-w-[700px]">Last updated: {lastUpdated}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to NoTrumpNWay. These Terms of Service ("Terms") govern your access to and use of NoTrumpNWay's
              website, services, and products, including our greeting cards, games, and merchandise (collectively, the
              "Services").
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these
              Terms, you may not access or use the Services. Please read these Terms carefully before using our
              Services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Registration and Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              To access certain features of our Services, you may need to create an account. When you register, you
              agree to provide accurate, current, and complete information about yourself.
            </p>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account password</li>
              <li>Restricting access to your account</li>
              <li>All activities that occur under your account</li>
            </ul>
            <p>
              You must notify NoTrumpNWay immediately of any unauthorized use of your account or any other breach of
              security. NoTrumpNWay will not be liable for any loss or damage arising from your failure to comply with
              this section.
            </p>
            <p>
              You must be at least 13 years old to create an account. If you are under 18, you represent that you have
              your parent or guardian's permission to use the Services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Greeting Cards and User-Generated Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Our Services allow you to create, customize, and share greeting cards and other content. When you create
              or share content through our Services, you retain ownership of any intellectual property rights you hold
              in that content.
            </p>
            <p>By creating, posting, or sharing content on or through our Services, you grant NoTrumpNWay:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                A non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, copy, modify,
                create derivative works based on, distribute, publicly display, and otherwise exploit such content in
                connection with the operation of the Services and NoTrumpNWay's business
              </li>
              <li>
                The right to display your username in connection with your content, subject to your privacy settings
              </li>
            </ul>
            <p>You represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You own the content you post or have the right to grant the rights and licenses described in these Terms
              </li>
              <li>
                The posting and use of your content on or through the Services does not violate the privacy rights,
                publicity rights, copyrights, contract rights, intellectual property rights, or any other rights of any
                person
              </li>
            </ul>
            <p>
              NoTrumpNWay reserves the right to remove any content that violates these Terms or that we find
              objectionable for any reason, without prior notice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prohibited Content and Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You agree not to use our Services to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Create or share content that is illegal, fraudulent, defamatory, obscene, pornographic, invasive of
                privacy, infringing on intellectual property rights, or otherwise objectionable
              </li>
              <li>Harass, abuse, threaten, or intimidate other users</li>
              <li>
                Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or
                entity
              </li>
              <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
              <li>
                Attempt to gain unauthorized access to any portion of the Services or any other accounts, computer
                systems, or networks connected to the Services
              </li>
              <li>Use the Services for any illegal or unauthorized purpose</li>
              <li>
                Use automated means, including spiders, robots, crawlers, or data mining tools to download data from the
                Services
              </li>
              <li>Introduce viruses, worms, or other material that is malicious or technologically harmful</li>
            </ul>
            <p>
              NoTrumpNWay reserves the right to terminate your access to the Services for violations of this section or
              any other provision of these Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchases and Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              NoTrumpNWay offers various products for purchase, including physical merchandise and digital content. By
              making a purchase, you agree to pay the specified price for the product.
            </p>
            <h3 className="text-lg font-medium text-foreground">Physical Merchandise</h3>
            <p>For physical merchandise:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are in U.S. dollars unless otherwise specified</li>
              <li>Applicable taxes and shipping fees will be added at checkout</li>
              <li>
                Product descriptions and images are for illustrative purposes only and actual products may vary slightly
              </li>
              <li>
                Shipping times are estimates and not guarantees; NoTrumpNWay is not responsible for delays due to
                shipping carriers or customs
              </li>
              <li>Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6">Digital Content</h3>
            <p>For digital content (including greeting cards and games):</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are granted a limited, non-exclusive, non-transferable license to access and use the digital content
                for personal, non-commercial purposes
              </li>
              <li>Digital content may not be transferred, reproduced, or distributed without our permission</li>
              <li>
                Due to the nature of digital products, all sales of digital content are final and non-refundable unless
                required by law
              </li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6">Refunds and Returns</h3>
            <p>
              For physical merchandise, we accept returns within 30 days of delivery for items in their original
              condition. Please contact{" "}
              <a href="mailto:donald@notrumpnway.com" className="text-primary hover:underline">
                donald@notrumpnway.com
              </a>{" "}
              to initiate a return.
            </p>
            <p>
              NoTrumpNWay reserves the right to refuse returns or refunds if items are damaged, used, or returned
              outside the return window.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The Services and their entire contents, features, and functionality (including but not limited to all
              information, software, text, displays, images, video, and audio, and the design, selection, and
              arrangement thereof) are owned by NoTrumpNWay, its licensors, or other providers of such material and are
              protected by United States and international copyright, trademark, patent, trade secret, and other
              intellectual property or proprietary rights laws.
            </p>
            <p>
              These Terms permit you to use the Services for your personal, non-commercial use only. You must not
              reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish,
              download, store, or transmit any of the material on our Services, except as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Your computer may temporarily store copies of such materials incidental to your accessing and viewing
                those materials
              </li>
              <li>
                You may store files that are automatically cached by your Web browser for display enhancement purposes
              </li>
              <li>
                You may print or download one copy of a reasonable number of pages of the website for your own personal,
                non-commercial use and not for further reproduction, publication, or distribution
              </li>
              <li>
                If we provide social media features with certain content, you may take such actions as are enabled by
                such features
              </li>
            </ul>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify copies of any materials from the Services</li>
              <li>
                Use any illustrations, photographs, video or audio sequences, or any graphics separately from the
                accompanying text
              </li>
              <li>
                Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials
                from the Services
              </li>
            </ul>
            <p>
              If you print, copy, modify, download, or otherwise use or provide any other person with access to any part
              of the Services in breach of the Terms, your right to use the Services will stop immediately and you must,
              at our option, return or destroy any copies of the materials you have made.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Games and Interactive Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              NoTrumpNWay offers various games and interactive features as part of its Services. When using these
              features:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You agree to use these features in accordance with all applicable rules and guidelines provided by
                NoTrumpNWay
              </li>
              <li>
                Any virtual items, points, or currencies acquired through games have no real-world value and cannot be
                exchanged for cash or other items of value
              </li>
              <li>
                NoTrumpNWay reserves the right to modify, suspend, or discontinue any game or interactive feature at any
                time without notice
              </li>
              <li>
                You acknowledge that your progress, achievements, and data related to games may be lost if you delete
                your account or if NoTrumpNWay discontinues the game
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disclaimer of Warranties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED. NOTRUMPNWAY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              NOTRUMPNWAY DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE
              CORRECTED, OR THAT THE SERVICES OR THE SERVER THAT MAKES THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER
              HARMFUL COMPONENTS.
            </p>
            <p>
              NOTRUMPNWAY MAKES NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE CONTENT ON
              THE SERVICES OR THE CONTENT OF ANY SITES LINKED TO THE SERVICES.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              IN NO EVENT WILL NOTRUMPNWAY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS,
              OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN
              CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, ANY WEBSITES LINKED TO THEM, ANY CONTENT ON
              THE SERVICES OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL
              DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF
              GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR
              OTHERWISE, EVEN IF FORESEEABLE.
            </p>
            <p>THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              You agree to defend, indemnify, and hold harmless NoTrumpNWay, its affiliates, licensors, and service
              providers, and its and their respective officers, directors, employees, contractors, agents, licensors,
              suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards,
              losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your
              violation of these Terms or your use of the Services, including, but not limited to, your User
              Contributions, any use of the Services' content, services, and products other than as expressly authorized
              in these Terms, or your use of any information obtained from the Services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governing Law and Jurisdiction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              These Terms and any dispute or claim arising out of or related to them, their subject matter, or their
              formation (in each case, including non-contractual disputes or claims) shall be governed by and construed
              in accordance with the laws of the State of [Your State], without giving effect to any choice or conflict
              of law provision or rule.
            </p>
            <p>
              Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Services shall be
              instituted exclusively in the federal courts of the United States or the courts of the State of [Your
              State], although we retain the right to bring any suit, action, or proceeding against you for breach of
              these Terms in your country of residence or any other relevant country.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              NoTrumpNWay may terminate or suspend your account and bar access to the Services immediately, without
              prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue using the Services, or contact us at{" "}
              <a href="mailto:donald@notrumpnway.com" className="text-primary hover:underline">
                donald@notrumpnway.com
              </a>
              .
            </p>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination,
              including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
              liability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may revise and update these Terms from time to time in our sole discretion. All changes are effective
              immediately when we post them, and apply to all access to and use of the Services thereafter.
            </p>
            <p>
              Your continued use of the Services following the posting of revised Terms means that you accept and agree
              to the changes. You are expected to check this page frequently so you are aware of any changes, as they
              are binding on you.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entire Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The Terms constitute the sole and entire agreement between you and NoTrumpNWay regarding the Services and
              supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both
              written and oral, regarding the Services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Questions about the Terms of Service should be sent to us at:</p>
            <p className="font-medium">
              <a href="mailto:donald@notrumpnway.com" className="text-primary hover:underline">
                donald@notrumpnway.com
              </a>
            </p>
            <p>
              NoTrumpNWay
              <br />
              1234 Political Avenue
              <br />
              Washington, DC 20001
              <br />
              United States
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
