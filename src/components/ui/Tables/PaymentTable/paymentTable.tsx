import { RequestsFormValues } from '../../../types/forms/RequestsForm/requestsForm';
import { useFieldArray, useFormContext } from "react-hook-form";
import { AuthContext } from '../../../../context/auth/authProvider';
import { useContext } from 'react';


export const PaymentTable = () => {
 const { control, register } = useFormContext<RequestsFormValues>();
  const {userRole} = useContext(AuthContext)!;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "paymentData"
  });

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-md mt-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registro de Pagos Aprobados</h2>
      
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {['DESCRIPCIÓN', 'MONTO PAGADO', 'COMPROBANTE REF'].map((opt)=>(
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                    {opt}
                </th>
            ))
            }
            {userRole === 'CEO'?(
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                  ACCIONES
              </th>
            ):(
              null
            )}            
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fields.map((field, index) => (   
            <tr className="hover:bg-gray-50 transition-colors" key={field.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-300">
                <input
                  type="text"                  
                  {...register(`paymentData.${index}.descripcionDePago`)}  
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese descripción"          
                  readOnly={userRole !== "CEO"}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-300">
                <input
                  type="number"
                  placeholder='0'
                  defaultValue={field.montoPagado??0}
                  {...register(`paymentData.${index}.montoPagado`, {
                      setValueAs: (v) => v === "" ? 0 : Number(v)
                  })}
                  readOnly={userRole !== "CEO"}
                />

              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-300">
                <input
                  type="text"                    
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Referencia"
                  {...register(`paymentData.${index}.referenciaBancaria`)}   
                  readOnly={userRole !== "CEO"}               
                />
              </td>
              {userRole === 'CEO' ?(
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-300">
                  <button
                    onClick={() => remove(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              ):(null)}              
            </tr>
          ))}
        </tbody>
      </table>
      
      {userRole === 'CEO' &&
        <div className="mt-6 flex justify-between items-center">
          <button
              onClick={() =>
                  append({ descripcionDePago: "", montoPagado: null, referenciaBancaria: "" })
              }
              type='button'
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Pago
          </button>
          
          <div className="text-sm text-gray-500">
            {/* {paymentData.length} {paymentData.length === 1 ? 'fila' : 'filas'} */}
          </div>
        </div>
      }
    </div>
  );
};