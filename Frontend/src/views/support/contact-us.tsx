import { Mail, Phone } from "lucide-react";

export function ContactUsComponent() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center py-5">
        <h2 className="text-1xl font-semibold">Or use our information below</h2>
        <div className="flex items-center space-x-2 space-y-2">
          <Mail className="text-muted-foreground" />
          <span>support@artauction.com</span>
        </div>
        <div className="flex items-center space-x-2 space-y-2">
          <Phone className="text-muted-foreground" />
          <span>+45 01 23 45 67</span>
        </div>
      </div>
    </div>
  );
}
