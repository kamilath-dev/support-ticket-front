export const useTicketStore = defineStore('ticket', {
  state: () => ({
    tickets: [],
    currentTicket: null,
    loading: false
  }),
  
  actions: {
    setTickets(tickets) {
      this.tickets = tickets
    },
    
    addTicket(ticket) {
      this.tickets.unshift(ticket)
    },
    
    updateTicket(updatedTicket) {
      const index = this.tickets.findIndex(t => t.id === updatedTicket.id)
      if (index !== -1) {
        this.tickets[index] = updatedTicket
      }
    },
    
    removeTicket(id) {
      this.tickets = this.tickets.filter(t => t.id !== id)
    },
    
    setCurrentTicket(ticket) {
      this.currentTicket = ticket
    },
    
    setLoading(loading) {
      this.loading = loading
    }
  }
})