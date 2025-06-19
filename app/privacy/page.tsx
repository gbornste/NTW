import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 19, 2025"

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground max-w-[700px]">Last updated: {lastUpdated}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              At NoTrumpNWay, we value your privacy and are committed to protecting your personal information. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
              website, use our services, or interact with our platform.
            </p>
            <p>
              We want you to understand what information we collect and how we use it to provide and improve our
              services. By accessing or using NoTrumpNWay, you consent to the practices described in this policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <h3 className="text-lg font-medium text-foreground">Information you provide to us</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Account information:</span> When you create an account, we collect your
                name, email address, password, and other information you choose to provide.
              </li>
              <li>
                <span className="font-medium">Profile information:</span> This includes your address, birthday, and
                other details you add to your profile.
              </li>
              <li>
                <span className="font-medium">Transaction information:</span> When you make a purchase, we collect
                payment information, billing and shipping address, and details about what you bought.
              </li>
              <li>
                <span className="font-medium">Communications:</span> We store copies of your messages, emails, or other
                communications with us.
              </li>
              <li>
                <span className="font-medium">User content:</span> Information you provide through our products or
                services, including when creating greeting cards or participating in games.
              </li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6">Information we collect automatically</h3>
            <p>When you access or use our services, we automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Device information:</span> Hardware model, operating system, unique device
                identifiers, mobile network information.
              </li>
              <li>
                <span className="font-medium">Log information:</span> Details of how you used our service, search terms,
                IP address, browser type, pages viewed, clicks, date/time stamps, referring/exit pages.
              </li>
              <li>
                <span className="font-medium">Cookies and similar technologies:</span> We use cookies and similar
                technologies to collect information about your activity, browser, and device.
              </li>
              <li>
                <span className="font-medium">Location information:</span> We may collect your precise or approximate
                location information.
              </li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6">Information from third parties</h3>
            <p>We may receive information about you from third parties, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Partners:</span> Business partners may share information with us when you
                use their services in connection with our services.
              </li>
              <li>
                <span className="font-medium">Service providers:</span> We may receive information from service
                providers who help us with our business operations.
              </li>
              <li>
                <span className="font-medium">Social media:</span> If you connect your social media accounts to
                NoTrumpNWay, we may receive information from those platforms.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative messages, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about products, services, offers, promotions, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize your experience and deliver content relevant to your interests</li>
              <li>Facilitate contests, sweepstakes, and promotions and process and deliver entries and rewards</li>
              <li>Develop new products and services</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We may share information about you in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">With your consent:</span> We may share information when you direct us to
                do so.
              </li>
              <li>
                <span className="font-medium">With service providers:</span> We share information with vendors,
                consultants, and other service providers who need access to such information to carry out work on our
                behalf.
              </li>
              <li>
                <span className="font-medium">For legal reasons:</span> We may disclose information if we believe it's
                necessary to comply with applicable laws, regulations, legal processes, or governmental requests.
              </li>
              <li>
                <span className="font-medium">In connection with a merger, sale, or acquisition:</span> If NoTrumpNWay
                is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be
                transferred as part of that transaction.
              </li>
              <li>
                <span className="font-medium">To protect rights and safety:</span> We may disclose information to
                protect the rights, property, and safety of NoTrumpNWay, our users, or others.
              </li>
              <li>
                <span className="font-medium">Aggregated or de-identified information:</span> We may share information
                that has been aggregated or de-identified, so that it can no longer reasonably be used to identify you.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We store the information we collect for as long as it is necessary for the purpose(s) for which we
              originally collected it. We may retain certain information for legitimate business purposes or as required
              by law.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <h3 className="text-lg font-medium text-foreground">Account Information</h3>
            <p>
              You can update, correct, or delete your account information at any time by logging into your account. If
              you wish to delete your account, please contact us at{" "}
              <a href="mailto:donald@notrumpnway.com" className="text-primary hover:underline">
                donald@notrumpnway.com
              </a>
              .
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6">Cookies</h3>
            <p>
              Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your
              browser to remove or reject cookies. Please note that if you choose to remove or reject cookies, this
              could affect the availability and functionality of our services.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6">Promotional Communications</h3>
            <p>
              You can opt out of receiving promotional emails from NoTrumpNWay by following the instructions in those
              emails. If you opt out, we may still send you non-promotional emails, such as those about your account or
              our ongoing business relations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Our services are not directed to children under 13 (or other age as required by local law), and we do not
              knowingly collect personal information from children. If we learn we have collected personal information
              from a child, we will delete that information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may transfer, process, and store information about you on servers located in various countries,
              including outside your country of residence. Data protection laws vary among countries, with some
              providing more protection than others.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page and updating the "Last updated" date at the top of this policy. You are
              advised to review this privacy policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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
