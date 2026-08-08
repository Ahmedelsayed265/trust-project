import { Check, Copy, Share2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type InviteShareCardProps = {
  code: string;
  link: string;
  email: string;
  name: string;
  copied: 'code' | 'link' | null;
  pending: boolean;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onCopy: (value: string, type: 'code' | 'link') => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function InviteShareCard({
  code,
  link,
  email,
  name,
  copied,
  pending,
  onEmailChange,
  onNameChange,
  onCopy,
  onSubmit,
}: InviteShareCardProps) {
  return (
    <Card>
      <CardHeader className="border-border border-b">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Share2 className="size-5" />
          </div>
          <div>
            <CardTitle>Share your invite</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Send your link or code — rewards unlock after first trade.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-foreground text-sm font-medium">Referral code</p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={code}
              className="bg-background h-12 rounded-xl px-3 font-semibold tracking-wide"
            />
            <Button
              type="button"
              variant="outline"
              className="h-12 shrink-0 rounded-xl px-4"
              onClick={() => onCopy(code, 'code')}
            >
              {copied === 'code' ? <Check /> : <Copy />}
              {copied === 'code' ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-foreground text-sm font-medium">Invite link</p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={link}
              className="bg-background h-12 rounded-xl px-3 font-mono text-xs"
            />
            <Button
              type="button"
              className="h-12 shrink-0 rounded-xl px-4"
              onClick={() => onCopy(link, 'link')}
            >
              {copied === 'link' ? <Check /> : <Copy />}
              {copied === 'link' ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 border-t pt-4">
          <p className="text-foreground text-sm font-medium">Invite by email</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              type="email"
              required
              placeholder="friend@email.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="bg-background h-11 rounded-xl"
              disabled={pending}
            />
            <Input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="bg-background h-11 rounded-xl"
              disabled={pending}
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="h-11 w-full rounded-xl"
            disabled={pending}
          >
            <UserPlus />
            {pending ? 'Sending…' : 'Send invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
