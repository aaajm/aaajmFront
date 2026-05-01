openapi: 3.0.3
info:
  version: 'latest'
  title: AAAJM API - Partie Albums/Photos/Galeries
  description: Parties de l'API relatives aux albums, photos et galeries

servers:
  - url: 'http://localhost:8080'

security:
  - BearerAuth: [ ]

paths:
  '/albums':
    get:
      tags:
        - File
      security:
        - []
      operationId: getAlbums
      parameters:
        - name: title
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Album"
        '400':
          $ref: '#/components/responses/400'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '429':
          $ref: '#/components/responses/429'
        '500':
          $ref: '#/components/responses/500'
    put:
      tags:
        - File
      operationId: addMediaToAlbum
      summary: Add media to album or update album title
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                album:
                  $ref: "#/components/schemas/CreateAlbum"
                images:
                  type: array
                  description: Filename must be changed as uuid for idempotent
                  items:
                    type: string
                    format: binary
            encoding:
              album:
                contentType: application/json
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Album"
        '400':
          $ref: '#/components/responses/400'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '429':
          $ref: '#/components/responses/429'
        '500':
          $ref: '#/components/responses/500'
  
  '/albums/{albumId}':
    post:
      tags:
        - File
      operationId: moveMediasAlbum
      summary: Move one/many existing files to another album
      parameters:
        - name: albumId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
            application/json:
              schema:
                type: object
                properties:
                  imageIds:
                    type: array
                    items:
                      type: string
      responses:
        '200':
          description: OK
        '400':
          $ref: '#/components/responses/400'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '429':
          $ref: '#/components/responses/429'
        '500':
          $ref: '#/components/responses/500'
    delete:
      tags:
        - File
      operationId: removeCompleteAlbum
      summary: Remove album with media associated
      parameters:
        - name: albumId
          in: path
          required: true
          schema:
            type: string
        - name: deleteImage
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: Removed
        '400':
          $ref: '#/components/responses/400'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '429':
          $ref: '#/components/responses/429'
        '500':
          $ref: '#/components/responses/500'
  
  '/albums/summary':
    get:
      tags:
        - File
      security:
        - []
      operationId: getAlbumSummary
      parameters:
        - name: title
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/AlbumSummary"
  
  '/files/{fileId}':
    delete:
      tags:
        - File
      operationId: deleteFile
      parameters:
        - name: fileId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Deleted
        '400':
          $ref: '#/components/responses/400'
        '403':
          $ref: '#/components/responses/403'
        '404':
          $ref: '#/components/responses/404'
        '429':
          $ref: '#/components/responses/429'
        '500':
          $ref: '#/components/responses/500'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
  
  responses:
    '400':
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/BadRequestException'
    '403':
      description: Forbidden
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/NotAuthorizedException'
    '404':
      description: Not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ResourceNotFoundException'
    '429':
      description: Too many requests to the API
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/TooManyRequestsException'
    '500':
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/InternalServerException'
  
  schemas:
    Exception:
      type: object
      properties:
        type:
          type: string
        message:
          type: string
    
    BadRequestException:
      allOf:
        - $ref: '#/components/schemas/Exception'
      example:
        type: BadRequestException
        message: Bad request
    
    NotAuthorizedException:
      allOf:
        - $ref: '#/components/schemas/Exception'
      example:
        type: NotAuthorizedException
        message: Not authorized
    
    ResourceNotFoundException:
      allOf:
        - $ref: '#/components/schemas/Exception'
      example:
        type: ResourceNotFoundException
        message: Resource of type <T> identified by <I> not found
    
    TooManyRequestsException:
      allOf:
        - $ref: '#/components/schemas/Exception'
      example:
        type: TooManyRequestsException
        message: Too many requests
    
    InternalServerException:
      allOf:
        - $ref: '#/components/schemas/Exception'
      example:
        type: InternalServerException
        message: Unexpected error
    
    Author:
      required: [id, firstname, lastname]
      properties:
        id:
          type: string
        firstname:
          type: string
        lastname:
          type: string
        profile:
          type: string
    
    FileInfo:
      required: [id, file_url]
      properties:
        id:
          type: string
        file_url:
          type: string
    
    Album:
      required: [id, title, createdBy]
      properties:
        id:
          type: string
        title:
          type: string
          minimum: 1
        creationDatetime:
          type: string
          format: date-time
        medias:
          type: array
          items:
            $ref: "#/components/schemas/FileInfo"
        createdBy:
          $ref: "#/components/schemas/Author"
    
    CreateAlbum:
      required: [id, title, authorId]
      properties:
        id:
          type: string
        title:
          type: string
          minimum: 1
        authorId:
          type: string
    
    AlbumSummary:
      required: [id, title]
      properties:
        id:
          type: string
        title:
          type: string