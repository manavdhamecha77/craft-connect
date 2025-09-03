
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { SettingsForm } from "./_components/settings-form"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Settings"
        description="Manage your account and store settings."
      />
      <div className="grid grid-cols-1 gap-8">
         <div className="md:col-span-3">
            <SettingsForm />
         </div>
      </div>
    </PageLayout>
  )
}
