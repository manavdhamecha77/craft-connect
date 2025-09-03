
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(250).optional(),
  storeName: z.string().min(2).max(50),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>


export function SettingsForm() {
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        name: "",
        email: "",
        bio: "",
        storeName: "",
    },
    mode: "onChange",
  })
  
  useEffect(() => {
    if (user) {
        form.reset({
            name: user.displayName || "",
            email: user.email || "",
            bio: "Passionate artisan specializing in traditional crafts. Each piece tells a story of heritage and dedication.", 
            storeName: user.displayName ? `${user.displayName}'s Creations` : "My Artisan Store"
        })
    }
  }, [user, form])

  function onSubmit(data: ProfileFormValues) {
    console.log(data)
    // Here you would typically handle the form submission,
    // e.g., update user profile in Firebase.
    toast({
      title: "Settings Saved!",
      description: "Your profile and store information has been updated.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card id="profile">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how others will see you on the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artisan/Community Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    products.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                   <FormControl>
                    <Input placeholder="Your Email" {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Your email address cannot be changed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself, your craft, and your passion."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short and sweet bio to introduce yourself to your customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Profile</Button>
          </CardFooter>
        </Card>

        <Card id="store">
          <CardHeader>
            <CardTitle>Store</CardTitle>
            <CardDescription>
              Manage your public store settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Store Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the title of your public artisan page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Store</Button>
          </CardFooter>
        </Card>
        
        <Card id="notifications">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                Configure how you receive notifications.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex items-center space-x-4">
                    <div className="space-y-0.5">
                        <label
                        htmlFor="new-sales"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        New Sales
                        </label>
                        <p className="text-[0.8rem] text-muted-foreground">
                        Receive an email for every new sale.
                        </p>
                    </div>
                    </div>
                    <Checkbox id="new-sales" defaultChecked/>
                </div>
                 <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex items-center space-x-4">
                    <div className="space-y-0.5">
                        <label
                        htmlFor="new-followers"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        New Followers
                        </label>
                        <p className="text-[0.8rem] text-muted-foreground">
                        Get notified when someone follows your store.
                        </p>
                    </div>
                    </div>
                    <Checkbox id="new-followers" defaultChecked/>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Update Notifications</Button>
            </CardFooter>
        </Card>

        <Card id="billing">
            <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                Manage your payment methods and subscription.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
                    <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 h-6 w-6"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                        Card
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem
                        value="paypal"
                        id="paypal"
                        className="peer sr-only"
                        />
                        <Label
                        htmlFor="paypal"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 h-6 w-6"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                        PayPal
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                        <Label
                        htmlFor="upi"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 h-6 w-6"><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m17.66 17.66 1.41 1.41" /><path d="M12 20v2" /><path d="m6.34 17.66-1.41 1.41" /><path d="M4 12H2" /><path d="m6.34 6.34-1.41-1.41" /></svg>
                        UPI
                        </Label>
                    </div>
                </RadioGroup>
                <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="**** **** **** 1234" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Update Billing</Button>
            </CardFooter>
        </Card>

      </form>
    </Form>
  )
}
