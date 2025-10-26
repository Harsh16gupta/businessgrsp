import React from 'react'
import RequirementForm from '@/components/b2b/RequirementForm';

interface PageProps {
  searchParams: {
    serviceType?: string;
    serviceId?: string;
  }
}

const page = ({ searchParams }: PageProps) => {
  return (
    <div className='pt-10'>
      <RequirementForm 
        preselectedService={searchParams.serviceType}
        serviceId={searchParams.serviceId}
      />
    </div>
  )
}

export default page