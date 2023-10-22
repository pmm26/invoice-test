import { createMocks } from 'node-mocks-http';
import next from "next";
import { NextResponse } from 'next/server'

import { GET, ContextType } from './route'
import * as db from '../../../../db';
import type { NextApiRequest, NextApiResponse } from "next";
import { faker } from '@faker-js/faker';
import { createInvoice, createLineItem } from '../../../../utils/data-helpers'

describe("Find Customer Route", () => {
  describe('GET /api/invoices/[recipientId]', () => {

    it('Invoices filtered', async () => {
      const req = {} as NextApiRequest;
      const invoice1 = createInvoice("2", "company1", 1)
      const invoiceWithStringDates = { ...invoice1, dateIssued: invoice1.dateIssued.toISOString(), dateDue: invoice1.dateDue.toISOString() }

      jest.spyOn(db, 'getInvoices').mockReturnValue([invoiceWithStringDates]
      )
      let json = jest.spyOn(NextResponse, 'json')

      const context = {
        method: 'GET',
        params: { id: "1" }
      } as ContextType;

      await GET(req, context);
      const expectedTotalPrice = 0

      expect(json).toHaveBeenLastCalledWith({
        data: {
          invoices: [],
          discount: 0,
          invoiceTotal: expectedTotalPrice,
          totalOwed: expectedTotalPrice,
          totalPaid: 0
        }
      }, { status: 200 });
    });

    it('Invoices settled', async () => {
      const req = {} as NextApiRequest;

      const userId = "1"
      const invoice1 = createInvoice(userId, "company1", 1)
      const lineItem1 = invoice1.items[0]


      // Values to change accorting to the test
      invoice1.settled = true
      lineItem1.price = 1000
      lineItem1.quantity = 4

      const invoiceWithStringDates = { ...invoice1, dateIssued: invoice1.dateIssued.toISOString(), dateDue: invoice1.dateDue.toISOString() }


      jest.spyOn(db, 'getInvoices').mockReturnValue([invoiceWithStringDates])
      let json = jest.spyOn(NextResponse, 'json')


      const context = {
        method: 'GET',
        params: { id: invoiceWithStringDates.recipient }
      } as ContextType;

      await GET(req, context);

      expect(json).toHaveBeenLastCalledWith({
        data: {
          invoices: [
            {
              ...invoiceWithStringDates,
              discount: 0,
              totalPrice: 4000,
            }],
          discount: 0,
          invoiceTotal: 4000,
          totalOwed: 0,
          totalPaid: 4000
        }
      }, { status: 200 });
    });

    it('Invoices not settled', async () => {
      const req = {} as NextApiRequest;

      const userId = "1"
      const invoice1 = createInvoice(userId, "company1", 2)
      const lineItem1 = invoice1.items[0]
      const lineItem2 = invoice1.items[1]


      // Values to change accorting to the test
      invoice1.settled = false

      lineItem1.price = 1000
      lineItem1.quantity = 4

      lineItem2.price = 2000
      lineItem2.quantity = 2

      const invoiceWithStringDates = { ...invoice1, dateIssued: invoice1.dateIssued.toISOString(), dateDue: invoice1.dateDue.toISOString() }

      jest.spyOn(db, 'getInvoices').mockReturnValue([invoiceWithStringDates]
      )
      let json = jest.spyOn(NextResponse, 'json')

      const context = {
        method: 'GET',
        params: { id: invoiceWithStringDates.recipient }
      } as ContextType;

      await GET(req, context);
      const expectedTotalPrice = 8000

      expect(json).toHaveBeenLastCalledWith({
        data: {
          invoices: [
            {
              ...invoiceWithStringDates,
              discount: 0,
              totalPrice: expectedTotalPrice,
            }],
          discount: 0,
          invoiceTotal: expectedTotalPrice,
          totalOwed: expectedTotalPrice,
          totalPaid: 0
        }
      }, { status: 200 });
    });


    it('Discount on unpaied Orders over 100', async () => {
      const req = {} as NextApiRequest;

      const userId = "1"
      const invoice1 = createInvoice(userId, "company1", 1)
      const lineItem1 = invoice1.items[0]

      // Values to change accorting to the test
      invoice1.settled = false

      lineItem1.price = 2000
      lineItem1.quantity = 8

      const invoiceWithStringDates = { ...invoice1, dateIssued: invoice1.dateIssued.toISOString(), dateDue: invoice1.dateDue.toISOString() }

      jest.spyOn(db, 'getInvoices').mockReturnValue([invoiceWithStringDates])
      let json = jest.spyOn(NextResponse, 'json')

      const context = {
        method: 'GET',
        params: { id: invoiceWithStringDates.recipient }
      } as ContextType;

      await GET(req, context);
      const expectedTotalPrice = 14400

      expect(json).toHaveBeenLastCalledWith({
        data: {
          invoices: [
            {
              ...invoiceWithStringDates,
              discount: 1600,
              totalPrice: expectedTotalPrice,
            }],
          discount: 1600,
          invoiceTotal: expectedTotalPrice,
          totalOwed: expectedTotalPrice,
          totalPaid: 0
        }
      }, { status: 200 });
    });
  })
});