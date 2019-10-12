Rails.application.routes.draw do
  root "trainers#index"
  resources :trainers, only: [:index]
  resources :pokemons, only: [:index, :show, :create, :destroy]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
