import { useAuthStore } from '~/stores/auth'

export const useTickets = () => {
  const ticketStore = useTicketStore()
  const { $api } = useNuxtApp()

  interface Ticket {
    id: string
    title: string
    description: string
    // backend may return an attachments array when fetching single ticket
    attachments?: Array<{ id: string; name: string; url: string }>
    [key: string]: any
  }

  type Paginated<T> = { content: T[]; totalPages?: number }

  const fetchTickets = async () => {
    ticketStore.setLoading(true)
    try {
      const response = await $api<Ticket[] | Paginated<Ticket>>('/tickets', {
        method: 'GET',
        credentials: 'include' // ← AJOUTEZ CETTE LIGNE
      })

      // some endpoints return a paginated object { content: [...], totalPages,... }
      // while dashboard only cares about the raw list. Normalize it here.
      const tickets: Ticket[] = Array.isArray(response)
        ? response
        : (response.content || []) as Ticket[]

      ticketStore.setTickets(tickets)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      ticketStore.setLoading(false)
    }
  }


  
  const fetchTicketById = async (id: string) => {
    ticketStore.setLoading(true)
    try {
      const ticket = await $api<Ticket>(`/tickets/${id}`)
      ticketStore.setCurrentTicket(ticket)
      return ticket
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw error
    } finally {
      ticketStore.setLoading(false)
    }
  }
  
  // Accept object or FormData (attachments)
  const createTicket = async (ticketData: Partial<Ticket> | FormData) => {
    ticketStore.setLoading(true)
    try {
      if (ticketData instanceof FormData) {
        const authStore = useAuthStore()
        if (authStore.token) {
          // include token as field so backend can fallback when header missing
          ticketData.append('token', authStore.token)
        }
      }

      const newTicket = await $api<Ticket>('/tickets', {
        method: 'POST',
        body: ticketData,
        credentials: 'include'
      })
      ticketStore.addTicket(newTicket)
      return { success: true, ticket: newTicket }
    } catch (error) {
      console.error('Error creating ticket:', error)
      return { success: false, error: 'Failed to create ticket' }
    } finally {
      ticketStore.setLoading(false)
    }
  }
  
  const updateTicket = async (id: string, ticketData: Partial<Ticket>) => {
    ticketStore.setLoading(true)
    try {
      const updatedTicket = await $api<Ticket>(`/tickets/${id}`, {
        method: 'PUT',
        body: ticketData
      })
      ticketStore.updateTicket(updatedTicket)
      return { success: true, ticket: updatedTicket }
    } catch (error) {
      console.error('Error updating ticket:', error)
      return { success: false, error: 'Failed to update ticket' }
    } finally {
      ticketStore.setLoading(false)
    }
  }
  
  const deleteTicket = async (id: string) => {
    ticketStore.setLoading(true)
    try {
      await $api(`/tickets/${id}`, {
        method: 'DELETE'
      })
      ticketStore.removeTicket(id)
      return { success: true }
    } catch (error) {
      console.error('Error deleting ticket:', error)
      return { success: false, error: 'Failed to delete ticket' }
    } finally {
      ticketStore.setLoading(false)
    }
  }
  
  return {
    tickets: computed(() => ticketStore.tickets),
    currentTicket: computed(() => ticketStore.currentTicket),
    loading: computed(() => ticketStore.loading),
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket
  }
}