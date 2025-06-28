export interface BreadcrumbRoute {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  routes: BreadcrumbRoute[];
  className?: string;
}