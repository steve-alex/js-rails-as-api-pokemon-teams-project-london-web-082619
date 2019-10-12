class PokemonsController < ApplicationController

    def index
        pokemons = Pokemon.all
        options = {only: [:id, :species, :nickname]}
        render json: PokemonSerializer.new(pokemons, options)
    end

    def show
        pokemon = Pokemon.find_by(id: params[:id].to_i)
        options = {only: [:id, :species, :nickname]}
        render json: PokemonSerializer.new(pokemon, options)
    end

    def create
        name = Faker::Name.first_name
        species = Faker::Games::Pokemon.name
        pokemon = Pokemon.create(nickname: name, species: species, trainer_id: params[:trainer_id])
        render json: PokemonSerializer.new(pokemon)
    end

    def destroy
        pokemon = Pokemon.find(params[:id].to_i)
        pokemon.destroy
        render json: pokemon
    end

end
