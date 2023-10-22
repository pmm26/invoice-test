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
import { PageWrapper } from "../components/pageWrapper";
import { GeneralBox } from "../components/generalBox";
import { Customer, Invoice } from "@/utils/data-helpers";
import axios from 'axios'
import InvoiceCompoent from '../components/Invoices/Invoice'

export default function Home() {
  return (
    <>
    <InvoiceCompoent />
    </>
  )
}
