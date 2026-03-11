// =============================================================================
// @repo/ui - The Shared Component Closet
// =============================================================================
//
// 🎭 ANALOGY: This is like a shared wardrobe in a theater production.
// All the actors (apps) can come here to borrow costumes (components)
// instead of each making their own from scratch!
//
// This package contains:
// - Custom components (Header, Counter)
// - Shadcn UI components (Button, Card)
// - Utility functions (cn for class merging)
// =============================================================================

// Custom Components
export { Header } from './components/Header'
export { Counter } from './components/Counter'

// Shadcn UI Components
export { Button, buttonVariants } from './components/ui/button'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/card'

// Shadcn UI - Additional Primitives
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './components/ui/dialog'
export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from './components/ui/drawer'
export { Input } from './components/ui/input'

// Utilities
export { cn } from './lib/utils'
