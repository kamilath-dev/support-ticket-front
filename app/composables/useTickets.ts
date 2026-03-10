export const useTickets = () => {
  const ticketStore = useTicketStore()
  const { $api } = useNuxtApp()
  
 const fetchTickets = async () => {
  ticketStore.setLoading(true)
  try {
    const tickets = await $api('/tickets', {
      method: 'GET',
      credentials: 'include'  // ← AJOUTEZ CETTE LIGNE
    })
    ticketStore.setTickets(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    ticketStore.setLoading(false)
  }
}


  
  const fetchTicketById = async (id) => {
    ticketStore.setLoading(true)
    try {
      const ticket = await $api(`/tickets/${id}`)
      ticketStore.setCurrentTicket(ticket)
      return ticket
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw error
    } finally {
      ticketStore.setLoading(false)
    }
  }
  
  const createTicket = async (ticketData) => {
  ticketStore.setLoading(true)
  try {
    const newTicket = await $api('/tickets', {
      method: 'POST',
      body: ticketData,
      credentials: 'include'  // ← AJOUTEZ CETTE LIGNE
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
  
  const updateTicket = async (id, ticketData) => {
    ticketStore.setLoading(true)
    try {
      const updatedTicket = await $api(`/tickets/${id}`, {
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
  
  const deleteTicket = async (id) => {
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