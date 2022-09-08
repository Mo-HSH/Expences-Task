Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  resources :expenses, only: [:index, :show, :create, :update, :destroy]
  resources :accounts, only: [:index, :show, :create, :update, :destroy]
end
