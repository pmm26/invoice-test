
'use client'
import { useState, useReducer, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from "@chakra-ui/react";
import { PageWrapper } from "../pageWrapper";
import { GeneralBox } from "../generalBox";
import { Customer, Invoice } from "@/utils/data-helpers";
import axios from 'axios'
import { format, compareAsc } from 'date-fns'


// Define action types
const LOAD_INVOICES = 'LOAD_INVOICES';
const LOAD_CUSTOMER = 'LOAD_CUSTOMER';
const OPEN_MODAL = "OPEN_MODAL";
const CLOSE_MODAL = "CLOSE_MODAL";

// Define action types as string literals
type ActionType =
  {
    type: typeof LOAD_INVOICES;
    invoices: Invoice[];
    discount: number;
    invoiceTotal: number;
    totalPaid: number;
    totalOwed: number;
  } | {
    type: typeof LOAD_CUSTOMER;
    customer: Customer;
  } |
  {
    type: typeof OPEN_MODAL;
    invoiceId: string;
  } |
  {
    type: typeof CLOSE_MODAL;
  }

// Define state type
type StateType = {
  userId: string;
  invoices: Invoice[] | null;
  customer: Customer | null;
  discount: number | null;
  invoiceTotal: number | null;
  totalPaid: number | null;
  totalOwed: number | null;
  deleteInvoiceModal: string | null
};

// Reducer function
const counterReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case LOAD_INVOICES:
      return {
        ...state, invoices: action.invoices,
        discount: action.discount,
        invoiceTotal: action.invoiceTotal,
        totalPaid: action.totalPaid,
        totalOwed: action.totalOwed,
      };
    case LOAD_CUSTOMER:
      return { ...state, customer: action.customer };
    case OPEN_MODAL:
      return { ...state, deleteInvoiceModal: action.invoiceId }
    case CLOSE_MODAL:
      return { ...state, deleteInvoiceModal: null }
    default:
      return state;
  }
};

const initialState: StateType = {
  userId: "5ac51f7e-81b1-49c6-9c39-78b2d171abd6",
  customer: null,
  invoices: null,
  discount: null,
  invoiceTotal: null,
  totalPaid: null,
  totalOwed: null,
  deleteInvoiceModal: null
};

const useInvoice = () => {

  const [state, dispatch] = useReducer(counterReducer, initialState);

  useEffect(() => {
    // Load User
    axios.get(`/api/findCustomer/${state.userId}`).then((response) => {
      dispatch({ type: LOAD_CUSTOMER, customer: response.data.data })
    })

    // Load invoices
    axios.get(`/api/invoices/${state.userId}`).then(response => {
      const invoiceData = response.data.data
      dispatch({
        type: LOAD_INVOICES,
        invoices: invoiceData.invoices.map((invoice: any) => ({
          ...invoice,
          dateIssued: new Date(invoice.dateIssued),
          dateDue: new Date(invoice.dateDue),
        })),
        discount: invoiceData.discount,
        invoiceTotal: invoiceData.invoiceTotal,
        totalPaid: invoiceData.totalPaid,
        totalOwed: invoiceData.totalOwed,
      })
    })
  }, [state.userId])


  const closeDeleteInvoiceModal = () => {
    dispatch({ type: CLOSE_MODAL })
  }

  const openDeleteInvoiceModal = (invoiceId: string) => {
    dispatch({ type: OPEN_MODAL, invoiceId  })
  }

  const deleteInvoice = async (invoiceId: string) => {
    axios.delete(`/api/invoices/${state.userId}`).then(response => {
      dispatch({ type: CLOSE_MODAL })
    }).catch(err => {
      console.log(err)
      dispatch({ type: CLOSE_MODAL })
    })
  }

  return {
    state,
    openDeleteInvoiceModal,
    closeDeleteInvoiceModal,
    deleteInvoice

  }
}

export default useInvoice