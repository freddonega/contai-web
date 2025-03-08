import { MonthlyTotalsByTypeResponse } from '@/types/dashboard';
import { FaCreditCard } from 'react-icons/fa';

export const PaymentTypeCart = (paymentType: MonthlyTotalsByTypeResponse) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <FaCreditCard className="text-3xl" />
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {paymentType.payment_type_name}
          </span>
          <h4 className={'mt-2 font-bold text-contai-red'}>
            -{' '}
            {paymentType.total.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </h4>
        </div>
      </div>
    </div>
  );
};
