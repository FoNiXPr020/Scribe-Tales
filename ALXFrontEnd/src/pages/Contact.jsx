import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import AdvancedMotion from "@/components/motions/AdvancedMotion";

export default function Contact() {
  return (
    <div className="dark:bg-background">
      <main className="w-full">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-1">

            <AdvancedMotion direction="top">
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
              <p className="text-muted-foreground md:text-xl">
                Have a question or want to collaborate? Get in touch with us.
              </p>
            </div>
            </AdvancedMotion>

            <AdvancedMotion direction="bottom">
            <div className="mx-auto mt-12 max-w-xl space-y-4">
              <form className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input id="name" placeholder="Your name" required className="col-span-1" />
                  <Input id="email" type="email" placeholder="Your email" required className="col-span-1" />
                </div>
                <Input id="subject" type="text" placeholder="Subject" required />
                <Textarea id="message" placeholder="Your message" required className="min-h-[120px]" />
                <Button type="submit" className="justify-center">
                  Send Message
                </Button>
              </form>
            </div>
            </AdvancedMotion>
          </div>
        </section>
      </main>
    </div>
  )
}