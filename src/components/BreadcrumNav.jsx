import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Home, User } from "lucide-react";

//breadcrumbs en el header
export function BreadcrumbNav({ pathSegments }) {
  const formatLabel = (segment) =>
    segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const isDynamic = (segment) => /^\d+$/.test(segment);

  const rootIcons = {
    start: <Home className="size-4" />,
    profile: <User className="size-4" />,
  };

  const items = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    const isRoot = index === 0 && rootIcons[segment];
    const icon = isRoot ? rootIcons[segment] : null;
    const label = isDynamic(segment) ? `#${segment}` : formatLabel(segment);

    const content = (
      <span className="flex items-center gap-1">
        {icon}
        {label}
      </span>
    );

    return (
      <BreadcrumbItem key={path}>
        {isLast ? (
          <BreadcrumbPage>{content}</BreadcrumbPage>
        ) : (
          <>
            <BreadcrumbLink asChild>
              <Link to={path}>{content}</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList>{items}</BreadcrumbList>
    </Breadcrumb>
  );
}

