const express = require('express');
const customers = require('./customers.json');

const app = express();
const port = process.env.PORT || 3000;
const validStatuses = new Set(['active', 'paused', 'churned']);

app.get('/api/customers', (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 0 || limit < 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pagination parameters',
    });
  }

  if (limit > 50) {
    return res.status(400).json({
      success: false,
      error: 'Limit cannot exceed 50',
    });
  }

  const { status, search } = req.query;
  if (status !== undefined && !validStatuses.has(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status',
    });
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus = status === undefined || customer.status === status;
    const matchesSearch = search === undefined || customer.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const start = (page - 1) * limit;
  const data = filteredCustomers.slice(start, start + limit).map((customer) => ({
    id: customer.id,
    name: customer.name,
    city: customer.city,
    status: customer.status,
    channel: customer.channel,
  }));

  res.status(200).json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total: filteredCustomers.length,
      totalPages: limit === 0 ? 0 : Math.ceil(filteredCustomers.length / limit),
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
