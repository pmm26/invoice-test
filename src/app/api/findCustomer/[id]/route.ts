import { NextResponse } from 'next/server'
import customerData from '../../../../data/customers.json';
import type { NextApiRequest, NextApiResponse } from "next";

interface ParamType {
  id: string;
}

interface ContextType {
  params: ParamType
}

export async function GET(request: Request, context: ContextType) {
  const data = customerData.customers.find(({id}) => id === context.params.id);
  return NextResponse.json(
    { data },
    {status: data ? 200 : 404}
  );
}