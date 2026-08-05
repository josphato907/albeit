import { mockEvents } from '@/lib/events'

export async function GET() {
  return Response.json(mockEvents)
}
