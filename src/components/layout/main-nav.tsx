import { DOCS_CONFIG } from "@/configs/docs";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import ScholarHubLogo from "../common/scholarhub-logo";

const MainNav = () => {
  const router = useRouterState();
  const pathName = router.location.pathname;
  return (
    <div className="hidden lg:flex mr-4">
      <Link to="/" className="flex items-center gap-2 mr-4 lg:mr-6">
        <ScholarHubLogo fontSize="text-xl" />
      </Link>
      <nav className="flex items-center gap-4 xl:gap-6 text-sm">
        {DOCS_CONFIG.mainNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "font-medium hover:text-foreground/80 transition-colors",
              pathName === item.href ? "text-foreground" : "text-foreground/80"
            )}
          >
            <div className="flex items-center">
              {item.icon && (
                <item.icon className="mr-2 size-4" aria-hidden="true" />
              )}
              {item.title}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MainNav;
