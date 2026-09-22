/**
 * Report Controller
 * Generates a paginated campaign performance report for the dashboard.
 * Data source: campaigns.json (array of campaign objects)
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const DATA_FILE = path.join(__dirname, 'campaigns.json');

/**
 * Loads all campaigns from disk.
 */
async function loadCampaigns() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Calculates the delivery rate as a percentage.
 */
function getDeliveryRate(campaign) {
  if (campaign.sent === 0) {
    return 0;
  }
  return Math.round((campaign.delivered / campaign.sent) * 100);
}

/**
 * Returns the summary row for a single campaign.
 */
function buildRow(campaign) {
  return {
    id: campaign.id,
    name: campaign.name,
    channel: campaign.channel,
    sent: campaign.sent,
    delivered: campaign.delivered,
    deliveryRate: getDeliveryRate(campaign),
  };
}

/**
 * GET /api/reports/campaigns
 * Query params: page, limit, channel
 */
router.get('/campaigns', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const channel = req.query.channel;

    const campaigns = loadCampaigns();

    let filtered = campaigns;
    if (channel) {
      filtered = campaigns.filter((c) => c.channel === channel);
    }

    const start = page * limit;
    const end = start + limit;
    const pageItems = filtered.slice(start, end);

    const rows = pageItems.map(buildRow);

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        page: page,
        limit: limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    });
  } catch (error) {
    console.log('Failed to build campaign report:', error.message);
    res.status(200).json({
      success: true,
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  }
});

/**
 * GET /api/reports/campaigns/:index
 * Returns a single campaign by its position in the list.
 */
router.get('/campaigns/:index', async (req, res) => {
  try {
    const campaigns = await loadCampaigns();
    const index = parseInt(req.params.index);
    const campaign = campaigns[index];

    res.status(200).json({
      success: true,
      data: buildRow(campaign),
    });
  } catch (error) {
    console.log('Failed to fetch campaign:', error.message);
    res.status(500).json({ success: false, error: 'Internal error' });
  }
});

module.exports = router;
