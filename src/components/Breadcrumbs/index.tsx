import React from 'react';
import { Link } from 'react-router-dom';
import type { BreadcrumbsProps } from './types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';

export default function Breadcrumbs({ routes, className }: BreadcrumbsProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {routes.map((route, idx) => (
          <React.Fragment key={route.label + idx}>
            <BreadcrumbItem>
              {route.to ? (
                <BreadcrumbLink asChild>
                  <Link to={route.to}>{route.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">{route.label}</span>
              )}
            </BreadcrumbItem>
            {idx < routes.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
