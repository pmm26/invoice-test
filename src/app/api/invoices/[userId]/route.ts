import { NextResponse } from 'next/server'
import invoiceData from '@/data/invoices.json';

interface ParamType {
  userId: string;
}

interface ContextType {
  params: ParamType
}

export async function GET(request: Request, context: ContextType) {
  try {
    // Sort items
    const sortedInvoices = invoiceData.invoices.sort((a, b) => a.number - b.number);

    const filteredInvoices = sortedInvoices.filter(invoices => invoices.recipient == context.params.userId)

    const invoices = filteredInvoices.map(invoice => {
      const totalItemPrice = invoice.items.reduce((total, item) => total + (item.price * item.quantity), 0)

      if (!invoice.settled && totalItemPrice > 10000) {
        const discount = (totalItemPrice * 10) / 100
        const totalPrice = totalItemPrice - discount

        return {
          ...invoice,
          discount: discount,
          totalPrice: totalPrice
        }
      }
    
      return {
        ...invoice,
        discount: 0,
        totalPrice: totalItemPrice
      }
    })


    return NextResponse.json({
      data: {
        invoices: invoices,
        discount: invoices.reduce((total, item) => total + item.discount, 0),
        invoiceTotal: invoices.reduce((total, item) => total + item.totalPrice, 0),
        totalPaid: invoices.reduce((total, item) => total + (item.settled ? item.totalPrice : 0), 0),
        totalOwed: invoices.reduce((total, item) => total + (item.settled ? 0 : item.totalPrice), 0),
      }
    })
  } catch (err) {
    return NextResponse.
      // status(500)
      json({ message: "Something went wrong" })
  }
}