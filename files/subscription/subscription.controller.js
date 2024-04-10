const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode");
const { responseHandler } = require("../../core/response");
const { manageAsyncOps, fileModifier } = require("../../utils");
const { CustomError } = require("../../utils/errors");
const { SubscriptionService } = require("./subscription.service");

const createSubscriptionController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionService.createSubscriptionService(req.body)
  );

  if (error) return next(error);

  if (!data.success)
    return next(new CustomError(data.message, BAD_REQUEST, data));

  return responseHandler(res, SUCCESS, data);
};

const getSubscriptionsController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionService.getSubscription(req.query)
  );

  if (error) return next(error);

  if (!data.success)
    return next(new CustomError(data.message, BAD_REQUEST, data));

  return responseHandler(res, SUCCESS, data);
};

const updateSubscriptionController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionService.updateSubscriptionService(req)
  );

  if (error) return next(error);

  if (!data.success)
    return next(new CustomError(data.message, BAD_REQUEST, data));

  return responseHandler(res, SUCCESS, data);
};

const deleteSubscriptionController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionService.deleteSubscriptionService({
      params: req.params,
      body: { isDeleted: true },
    })
  );

  if (error) return next(error);

  if (!data.success)
    return next(new CustomError(data.message, BAD_REQUEST, data));

  return responseHandler(res, SUCCESS, data);
};

module.exports = {
  createSubscriptionController,
  getSubscriptionsController,
  updateSubscriptionController,
  deleteSubscriptionController,
};
