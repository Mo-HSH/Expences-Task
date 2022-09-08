# frozen_string_literal: true

class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_exception

  def handle_exception(exception)
    case exception
    when ActionController::RoutingError, AbstractController::ActionNotFound, ActiveRecord::RecordNotFound
      message = "Resource not found."
      render_error(message, :not_found)
    when ActionController::BadRequest, ActionController::ParameterMissing, ActionController::UnpermittedParameters
      message = <<~ERROR
        The request is missing a required parameter, includes an invalid
        parameter value, includes a parameter more than once, or is
        otherwise malformed.
      ERROR
      render_error(message, :bad_request)
    when ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved, ActiveRecord::RecordNotDestroyed
      render_error(exception.message, exception.try(:status_code) || :unprocessable_entity)
    else
      message = "Unexpected error: #{exception.class} - #{exception}"
      return render_error(message, :internal_server_error)
    end
  end

  def render_error(message, status = :unprocessable_entity)
    render json: {
        error: status,
        error_message: message
    }, status: status
  end
end
