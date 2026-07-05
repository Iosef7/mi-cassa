'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(leadId: string, newStatus: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: newStatus }
    });
    revalidatePath('/admin/prospectos');
    return { success: true };
  } catch (error) {
    console.error('Error updating lead status:', error);
    return { success: false, error: 'Failed to update lead status' };
  }
}

export async function createLead(data: any) {
  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        status: data.status || 'NUEVO',
        budget: data.budget ? parseFloat(data.budget) : null,
        notes: data.notes || null,
        source: data.source || 'MANUAL',
        preferences: data.preferences || null,
        requiresMortgage: data.requiresMortgage || false,
        type: data.type || 'CLIENTE',
        urgency: data.urgency || null,
        propertyTypeOfInterest: data.propertyTypeOfInterest || null,
        hasPropertyToSell: data.hasPropertyToSell || false,
        reasonForSelling: data.reasonForSelling || null,
        acceptsTrade: data.acceptsTrade || false,
        viewingAvailability: data.viewingAvailability || null,
        targetLocations: data.targetLocations || null,
        isLegalClear: data.isLegalClear !== undefined ? data.isLegalClear : true,
        hasMortgage: data.hasMortgage || false,
        mandateType: data.mandateType || null,
      }
    });
    revalidatePath('/admin/prospectos');
    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false, error: 'Failed to create lead' };
  }
}

export async function updateLead(leadId: string, data: any) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        status: data.status || 'NUEVO',
        budget: data.budget ? parseFloat(data.budget) : null,
        notes: data.notes || null,
        preferences: data.preferences || null,
        requiresMortgage: data.requiresMortgage || false,
        type: data.type || 'CLIENTE',
        urgency: data.urgency || null,
        propertyTypeOfInterest: data.propertyTypeOfInterest || null,
        hasPropertyToSell: data.hasPropertyToSell || false,
        reasonForSelling: data.reasonForSelling || null,
        acceptsTrade: data.acceptsTrade || false,
        viewingAvailability: data.viewingAvailability || null,
        targetLocations: data.targetLocations || null,
        isLegalClear: data.isLegalClear !== undefined ? data.isLegalClear : true,
        hasMortgage: data.hasMortgage || false,
        mandateType: data.mandateType || null,
      }
    });
    revalidatePath('/admin/prospectos');
    revalidatePath(`/admin/prospectos/${leadId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating lead:', error);
    return { success: false, error: 'Failed to update lead' };
  }
}
