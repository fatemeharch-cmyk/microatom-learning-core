import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, ShieldCheck, Bell, Globe, Sparkles } from "lucide-react";
import { systemSettings, roleLabelsFa } from "@/lib/admin-mock";
import { useState } from "react";

export const Route = createFileRoute("/admin/system")({
  component: AdminSystem,
});

function AdminSystem() {
  const [notif, setNotif] = useState(systemSettings.notifications);
  const [brand, setBrand] = useState(systemSettings.branding);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> تنظیمات سیستم
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          پیکربندی کلی پلتفرم، اعلان‌ها، زبان و برندینگ مدرسه.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> سال تحصیلی و زبان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">سال تحصیلی</Label>
              <Input defaultValue={systemSettings.schoolYear} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">زبان پیش‌فرض</Label>
              <div className="flex gap-2">
                <Badge variant="secondary" className="rounded-lg bg-primary/10 text-primary">فارسی (RTL)</Badge>
                <Badge variant="secondary" className="rounded-lg">English</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> ترجیحات اعلان‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row label="ایمیل" checked={notif.email} onChange={(v) => setNotif((s) => ({ ...s, email: v }))} />
            <Row label="پیامک" checked={notif.sms} onChange={(v) => setNotif((s) => ({ ...s, sms: v }))} />
            <Row label="درون‌برنامه‌ای" checked={notif.inApp} onChange={(v) => setNotif((s) => ({ ...s, inApp: v }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> برندینگ پلتفرم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">نام نمایشی</Label>
              <Input value={brand.name} onChange={(e) => setBrand((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">شعار</Label>
              <Input value={brand.tagline} onChange={(e) => setBrand((s) => ({ ...s, tagline: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> نمای دسترسی نقش‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {systemSettings.rolePermissions.map((r) => (
              <div key={r.role} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 gap-3">
                <Badge variant="secondary" className="rounded-lg shrink-0">{roleLabelsFa[r.role]}</Badge>
                <span className="text-xs text-muted-foreground text-end">{r.scope}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
