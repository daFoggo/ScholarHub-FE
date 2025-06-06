import { LoginForm } from '@/features/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
    <div className="w-full max-w-md">
      <LoginForm />
    </div>
  </div>
}
