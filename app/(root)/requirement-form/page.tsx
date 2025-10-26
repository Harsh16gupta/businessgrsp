import React from 'react'
import RequirementForm from '@/components/b2b/RequirementForm';

const Page = async (props: {
  searchParams: Promise<{
    serviceType?: string;
    serviceId?: string;
  }>
}) => {
  const searchParams = await props.searchParams;

  return (
    <div className='pt-10'>
      <RequirementForm 
        preselectedService={searchParams.serviceType}
        serviceId={searchParams.serviceId}
      />
    </div>
  )
}

export default Page