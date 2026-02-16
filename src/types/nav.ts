export interface BaseNavItem {
  type: string
  label: string
  href: string
}

export interface LinkNavItem extends BaseNavItem {
  type: "link"
}

export interface DropdownNavItem extends BaseNavItem {
  type: "dropdown"
  id?: string
  sub?: SubNavItem[]
}

export interface SubNavItem {
  type: "link"
  label: string
  href: string
}

export type NavItem = LinkNavItem | DropdownNavItem

export interface NavData {
  navData: NavItem[]
}
