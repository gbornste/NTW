import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">About NoTrumpNWay</h1>
        <p className="text-muted-foreground max-w-[700px]">
          Learn more about our mission and the story behind NoTrumpNWay.
        </p>
      </div>

      <div className="grid gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              NoTrumpNWay is a creative platform dedicated to engaging and inspiring political expression through humor
              and satire. By offering original greeting cards, games, and merchandise, we aim to shed light on
              controversial presidential decisions and encourage active participation in the political process. Our goal
              is to foster dialogue, awareness, and a sense of community—all while having fun.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Founded in 2023, NoTrumpNWay started as a small project among friends who shared a passion for politics
              and creative expression. What began as a hobby quickly grew into a platform that resonates with many
              people looking for ways to express their political views in a fun and creative manner.
            </p>
            <p className="text-muted-foreground mt-4">
              Today, we continue to grow our collection of greeting cards, games, and merchandise, always with the goal
              of providing high-quality, thoughtful products that spark conversation and engagement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Have questions or feedback? We'd love to hear from you! Reach out to us at:
            </p>
            <p className="font-medium mt-2">donald@notrumpnway.com</p>
            <p className="text-muted-foreground mt-4">For business inquiries, please email: donald@notrumpnway.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
