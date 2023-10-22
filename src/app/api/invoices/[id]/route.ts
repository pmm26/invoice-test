import { NextResponse } from 'next/server'
import { getInvoices, deleteInvoice } from '../../../../db'
interface ParamType {
  id: string;
}

export interface ContextType {
  params: ParamType
}

interface InvoicesRaw {
  id: string;
  number: number;
  dateIssued: Date;
  dateDue: Date;
  settled: boolean;
  recipient: string;
  patron: string;
  items: {
    title: string;
    description: string;
    price: number;
    quantity: number;
  }[];
}[]


interface InvoicesCalculated {
  discount: number;
  totalPrice: number;
  id: string;
  number: number;
  dateIssued: Date;
  dateDue: Date;
  settled: boolean;
  recipient: string;
  patron: string;
  items: {
    title: string;
    description: string;
    price: number;
    quantity: number;
  }[];
}[]

// NextApiResponse &
export async function GET(request: Request, context: ContextType) {
  try {
    const userId = context.params.id

    const filteredInvoices = userId ?
      getInvoices().filter(invoices => invoices.recipient == userId) :
      getInvoices()

    const sortedInvoices = filteredInvoices.sort((a, b) => a.number - b.number);

    const invoices = sortedInvoices.map(invoice => {
      const totalItemPrice = invoice.items.reduce((total, item) => total + (item.price * item.quantity), 0)

      if (!invoice.settled && totalItemPrice > 10000) {
        const discount = Math.round((totalItemPrice * 10) / 100)
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
        invoices,
        discount: invoices.reduce((total, item) => total + item.discount, 0),
        invoiceTotal: invoices.reduce((total, item) => total + item.totalPrice, 0),
        totalPaid: invoices.reduce((total, item) => total + (item.settled ? item.totalPrice : 0), 0),
        totalOwed: invoices.reduce((total, item) => total + (item.settled ? 0 : item.totalPrice), 0),
      }
    }, { status: 200 })

  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}


export async function DELETE(request: any, context: any) {
  try {
    // Get Invoice Id
    const invoiceId = context.params.id

    //Saving new Invoice List.
    deleteInvoice(invoiceId)

    return NextResponse.json({
      data: {
        message: "Invoice deleted"
      }
    }, { status: 200 })


  } catch (err) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
