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
import { currency } from '../../utils/lib'
import useInvoice from './useInvoice'
// import styles from './invoice.module.css'
import './invoice.css'

export default function Home() {
  const { state, closeDeleteInvoiceModal, openDeleteInvoiceModal, deleteInvoice } = useInvoice()

  return (
    <div className="InvoicePage">
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
            <div className="WrapperComponent">
              <Table fontSize="sm" variant='striped'>
                <Thead>
                  <Tr>
                    <Th >Invoice #</Th>
                    <Th>Date Due</Th>
                    <Th>Date Sent</Th>
                    <Th>Amount</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {state?.invoices && state?.invoices?.map(({
                    number,
                    // amount,
                    id,
                    dateDue,
                    dateIssued,
                    settled,
                    discount,
                    // @ts-ignore
                    totalPrice
                  }, index) => (
                    <Tr key={id} backgroundColor={index % 2 ? undefined : "lightblue"} className='tr' >
                      <InvoiceTableTd position={"sticky"} className="sticky-column" settled={settled}>{number}</InvoiceTableTd>
                      <InvoiceTableTd flex={1} settled={settled}>{format(dateDue, 'MM/dd/yyyy')}</InvoiceTableTd>
                      <InvoiceTableTd flex={1} settled={settled}>{format(dateIssued, 'MM/dd/yyyy')}</InvoiceTableTd>
                      {/* @ts-ignore */}
                      <InvoiceTableTd discount={discount > 0} settled={settled} >{currency(totalPrice)}</InvoiceTableTd>
                      <Td><IconButton onClick={() => openDeleteInvoiceModal(id)} aria-label='Search database' icon={<DeleteIcon />} /></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </TableContainer>
        </GeneralBox>

        <div className="TotalsContainer">
          {/* <div className="table" > */}
            <GeneralBox >
              <Table className='table' fontSize="sm" variant='striped' overflowX="auto">
                <Tbody>
                  <Tr backgroundColor="lightblue">
                    <Td><strong>Discount:</strong></Td>
                    {/* @ts-ignore */}
                    <Td textAlign="right">{currency(state.discount)}</Td>
                  </Tr>
                  <Tr>
                    <Td><strong>Invoice Total:</strong></Td>
                    {/* @ts-ignore */}
                    <Td textAlign="right">{currency(state.invoiceTotal)}</Td>
                  </Tr>
                  
                  <Tr backgroundColor="lightblue">
                    <Td><strong>Total Paid:</strong></Td>
                    {/* @ts-ignore */}
                    <Td textAlign="right">{currency(state.totalPaid)}</Td>
                  </Tr>
                  <Tr >
                    <Td border="none"><strong>Total Owed:</strong></Td>
                    {/* @ts-ignore */}
                    <Td border="none" textAlign="right">{currency(state.totalOwed)}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </GeneralBox>
          </div>
        {/* </div> */}
      </PageWrapper>
    </div>
  )
}

const InvoiceTableTd = ({ discount, settled, children, className, sticky, flex }: { discount?: boolean, settled: boolean, children: any, className?: string , sticky?: string, flex?: string}) => {

  const textColor = (function () {
    // function body
    if (discount) {
      return "green";
    }
    if (!settled) {
      return "red";
    }
  })();

  return (
    <Td sticky={sticky} className={className} textColor={textColor}>{children}</Td>
  )
}