import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, User } from "lucide-react";

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block">TimeTrack</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium max-w-[120px] truncate">
              {user?.email}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
