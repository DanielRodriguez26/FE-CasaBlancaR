import { ComponentType } from 'react'

export interface RouteConfig {
    path: string
    component: ComponentType
    title: string
    requiredRoles?: string[]
}

export interface RouteParams {
    [key: string]: string | undefined
}

export interface NavigationItem {
    path: string
    label: string
    icon?: string
    requiredRoles?: string[]
}
