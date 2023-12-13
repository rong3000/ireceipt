import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery(
    {
      baseUrl: 'https://api.ireceipts.au:443',
      prepareHeaders: (headers, { getState }) => {
        const accessToken = getState().authx.user?.accessToken;

        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`);
        }

        headers.set('api-version', '0.1');

        return headers;
      },
    }
  ),
  endpoints: (builder) => ({
    getReceipts: builder.query({
      query: () => '/Receipt/GetReceipts',
    }),
    updateReceipt: builder.mutation({
      query: (receiptData) => ({
        url: '/Receipt/UpdateReceipt',
        method: 'POST',
        body: receiptData,
      }),
    }),
    uploadReceipt: builder.mutation({
      query: (formData) => ({
        url: '/Receipt/UploadReceiptImages/0',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useGetReceiptsQuery, useUpdateReceiptMutation, useUploadReceiptMutation } = api;