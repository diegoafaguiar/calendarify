"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchOrganizations, fetchCalendarEvents } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { PieChart, PieChartProps } from '@/components/ui/pie-chart';
import { BarChart, BarChartProps } from '@/components/ui/bar-chart';

export default function Dashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadOrganizations();
    loadEvents();
  }, []);

  const loadOrganizations = async () => {
    try {
      const fetchedOrganizations = await fetchOrganizations();
      setOrganizations(fetchedOrganizations);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const fetchedEvents = await fetchCalendarEvents('all', 'all');
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const calculateHoursByOrganization = () => {
    const hoursByOrg = {};
    events.forEach(event => {
      const orgId = event.organization?.id || 'Unassigned';
      const duration = (new Date(event.end) - new Date(event.start)) / (1000 * 60 * 60);
      hoursByOrg[orgId] = (hoursByOrg[orgId] || 0) + duration;
    });
    return Object.entries(hoursByOrg).map(([orgId, hours]) => ({
      name: organizations.find(org => org.id === orgId)?.name || 'Unassigned',
      value: hours,
      color: organizations.find(org => org.id === orgId)?.color || '#808080'
    }));
  };

  const hoursByOrganization = calculateHoursByOrganization();

  const pieChartData: PieChartProps['data'] = hoursByOrganization.map(org => ({
    label: org.name,
    value: org.value,
    color: org.color,
  }));

  const barChartData: BarChartProps['data'] = {
    labels: hoursByOrganization.map(org => org.name),
    datasets: [
      {
        label: 'Hours Planned',
        data: hoursByOrganization.map(org => org.value),
        backgroundColor: hoursByOrganization.map(org => org.color),
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hours Planned by Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Organization Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hoursByOrganization.map((org, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge style={{ backgroundColor: org.color }} className="mr-2 w-3 h-3 rounded-full" />
                    <span>{org.name}</span>
                  </div>
                  <span>{org.value.toFixed(2)} hours</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Hours Planned by Organization (Bar Chart)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={barChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}