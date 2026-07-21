'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface LeadFormData {
  name: string;
  email?: string;
  phone: string;
  status?: string;
  budget?: string | number;
  notes?: string;
  source?: string;
  preferences?: string;
  requiresMortgage?: boolean;
  type?: string;
  urgency?: string;
  propertyTypeOfInterest?: string;
  hasPropertyToSell?: boolean;
  reasonForSelling?: string;
  acceptsTrade?: boolean;
  viewingAvailability?: string;
  targetLocations?: string;
  targetArea?: string | number;
  minArea?: string | number;
  maxArea?: string | number;
  moveInDate?: string | Date;
  numberOfPeople?: string | number;
  petFriendly?: boolean;
  isLegalClear?: boolean;
  hasMortgage?: boolean;
  mandateType?: string;
  propertyId?: string;
  agentId?: string;
  contactDate?: string | Date;
}

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

export async function createLead(data: LeadFormData) {
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
        targetArea: data.targetArea ? parseFloat(data.targetArea) : null,
        minArea: data.minArea ? parseFloat(data.minArea) : null,
        maxArea: data.maxArea ? parseFloat(data.maxArea) : null,
        moveInDate: data.moveInDate ? new Date(data.moveInDate) : null,
        numberOfPeople: data.numberOfPeople ? parseInt(data.numberOfPeople) : null,
        petFriendly: data.petFriendly || false,
        isLegalClear: data.isLegalClear !== undefined ? data.isLegalClear : true,
        hasMortgage: data.hasMortgage || false,
        mandateType: data.mandateType || null,
        propertyId: data.propertyId || null,
        agentId: data.agentId || null,
        contactDate: data.contactDate ? new Date(data.contactDate) : null,
      }
    });
    revalidatePath('/admin/prospectos');
    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false, error: 'Failed to create lead' };
  }
}

export async function updateLead(leadId: string, data: LeadFormData) {
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
        targetArea: data.targetArea ? parseFloat(data.targetArea) : null,
        minArea: data.minArea ? parseFloat(data.minArea) : null,
        maxArea: data.maxArea ? parseFloat(data.maxArea) : null,
        moveInDate: data.moveInDate ? new Date(data.moveInDate) : null,
        numberOfPeople: data.numberOfPeople ? parseInt(data.numberOfPeople) : null,
        petFriendly: data.petFriendly || false,
        isLegalClear: data.isLegalClear !== undefined ? data.isLegalClear : true,
        hasMortgage: data.hasMortgage || false,
        mandateType: data.mandateType || null,
        propertyId: data.propertyId || null,
        agentId: data.agentId || null,
        contactDate: data.contactDate ? new Date(data.contactDate) : null,
      }
    });
    revalidatePath('/admin/prospectos');
    revalidatePath(`/admin/prospectos/${leadId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return { success: false, error: error.message || 'Failed to update lead' };
  }
}

export async function getSmartMatches(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { budget: true, propertyTypeOfInterest: true, targetLocations: true }
    });

    if (!lead || !lead.budget) {
      return { success: true, matches: [] };
    }

    const margin = 0.2; // 20% margin
    const minBudget = Number(lead.budget) * (1 - margin);
    const maxBudget = Number(lead.budget) * (1 + margin);

    const matches = await prisma.property.findMany({
      where: {
        price: {
          gte: minBudget,
          lte: maxBudget
        },
        status: 'DISPONIBLE'
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        images: true,
        type: true,
        location: true,
        bedrooms: true,
        bathrooms: true
      }
    });

    return { success: true, matches };
  } catch (error) {
    console.error('Error getting smart matches:', error);
    return { success: false, error: 'Failed to get matches' };
  }
}
