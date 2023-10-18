'use client'
import { DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import {
  Flex,
  Button,
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
import { currency } from '../../../utils/lib'
import useInvoice from './useInvoice'

export default function Home() {
  const { state, closeDeleteInvoiceModal, openDeleteInvoiceModal,  deleteInvoice } = useInvoice()
  console.log()
  return (
    <>
      <PageWrapper>
      <Modal isOpen={!!state.deleteInvoiceModal} onClose={closeDeleteInvoiceModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {"Are you sure? This action can\'t be undone"}
           </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={closeDeleteInvoiceModal}>
              Close
            </Button>
            <Button onClick={deleteInvoice} colorScheme='red'>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        <GeneralBox>
          <Heading as="h2" size="lg">Invoices</Heading>
          <Text>Displaying invoices for <strong>{state?.customer?.name}</strong></Text>
        </GeneralBox>

        <GeneralBox>
          <TableContainer>
            <Table fontSize="sm">
              <Thead>
                <Tr>
                  <Th>Invoice #</Th>
                  <Th>Date Due</Th>
                  <Th>Date Sent</Th>
                  <Th>Amount</Th>
                  <Th>Actions</Th>

                  <Td></Td>
                </Tr>
              </Thead>
              <Tbody>
                {state?.invoices && state?.invoices?.map(({
                  number,
                  // amount,
                  id,
                  dateDue,
                  dateIssued,
                  ...other
                }, index) => (
                  <Tr key={id} backgroundColor={index % 2 ? undefined : "grey"} >
                    <Td>{number}</Td>
                    <Td>{format(dateDue, 'MM/dd/yyyy')}</Td>
                    <Td>{format(dateIssued, 'MM/dd/yyyy')}</Td>
                    {/* @ts-ignore */}
                    <Td>{currency(other.totalPrice)}</Td>
                    <Td><IconButton onClick={() => openDeleteInvoiceModal(id)} aria-label='Search database' icon={<DeleteIcon />} /></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </GeneralBox>
        <GeneralBox>
          <Table fontSize="sm">
            <Tbody>
              <Tr>
                <Td><strong>Discount:</strong></Td>
                {/* @ts-ignore */}

                <Td textAlign="right">{currency(state.discount)}</Td>
              </Tr>
              <Tr>
                <Td><strong>Invoice Total:</strong></Td>
                {/* @ts-ignore */}
                <Td textAlign="right">{currency(state.invoiceTotal)}</Td>
              </Tr>
              <Tr>
                <Td><strong>Total Paid:</strong></Td>
                {/* @ts-ignore */}
                <Td textAlign="right">{currency(state.totalPaid)}</Td>
              </Tr>
              <Tr>
                <Td border="none"><strong>Total Owed:</strong></Td>
                {/* @ts-ignore */}
                <Td border="none" textAlign="right">{currency(state.totalOwed)}</Td>
              </Tr>
            </Tbody>
          </Table>
        </GeneralBox>
      </PageWrapper>
    </>
  )
}
